import type { RouteHandler } from '@hono/zod-openapi';
import type { addAttachmentRoute, extractPagesRoute, mergeRoute, readMetaRoute, setMetaRoute } from './pdfTransformations.dal';
import type { AuthorizationBinding } from '@shared/types.global';
import { PDFDocument } from 'pdf-lib';
import { and, eq, inArray, db, fileTable } from 'db';
import { createCustomError, handleTransformationOutput, streamFile } from '@utils/utils.hono';
import { createPdfInstance, getFilePath, Uint8ArrayToBuffer, Uint8ArrayToStream } from '@utils/utils.general';
import { getFileEntry } from '@utils/utils.db';

export const mergeHandler: RouteHandler<typeof mergeRoute, AuthorizationBinding> = async (c) => {
  const { outputMethod, pdfIdList } = c.req.valid('json');
  const storeId = c.get('storeId');

  const entries = await db.query.fileTable.findMany({
    where: and(eq(fileTable.storeId, storeId), eq(fileTable.extension, '.pdf'), inArray(fileTable.id, pdfIdList)),
  });
  if (entries.length < 2) return c.notFound();

  const mergedPdf = await PDFDocument.create();

  for (const e of entries) {
    const path = getFilePath(e.isPublic, e.index, e.extension, storeId);
    const pdfDocument = await Bun.file(path)
      .arrayBuffer()
      .then((arrayBuffer) => PDFDocument.load(arrayBuffer));
    const pages = await mergedPdf.copyPages(pdfDocument, pdfDocument.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const content = await mergedPdf.save();

  return handleTransformationOutput(c, storeId, Uint8ArrayToBuffer(content), '.pdf', outputMethod);
};

export const extractPagesHandler: RouteHandler<typeof extractPagesRoute, AuthorizationBinding> = async (c) => {
  const { outputMethod, id, pagesIndicies } = c.req.valid('json');
  const storeId = c.get('storeId');

  const instance = await createPdfInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  if (pagesIndicies.at(-1)! >= instance.right.pdf.getPageCount())
    return createCustomError(c, 'Pages indices must exist in the pdf', 'pages', 'invalid_arguments');

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(instance.right.pdf, pagesIndicies);
  copiedPages.forEach((p) => newPdf.addPage(p));

  const content = await newPdf.save();

  return handleTransformationOutput(c, storeId, Uint8ArrayToBuffer(content), '.pdf', outputMethod);
};

export const readMetaHandler: RouteHandler<typeof readMetaRoute, AuthorizationBinding> = async (c) => {
  const { id } = c.req.valid('param');
  const storeId = c.get('storeId');
  const instance = await createPdfInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  const meta = {
    title: instance.right.pdf.getTitle(),
    author: instance.right.pdf.getAuthor(),
    subject: instance.right.pdf.getSubject(),
    creationDate: instance.right.pdf.getCreationDate(),
    modificationDate: instance.right.pdf.getModificationDate(),
    keywords: instance.right.pdf.getKeywords(),
    pageCount: instance.right.pdf.getPageCount(),
  };

  return c.json(meta);
};

export const setMetaHandler: RouteHandler<typeof setMetaRoute, AuthorizationBinding> = async (c) => {
  const { id, ...newMeta } = c.req.valid('json');
  const storeId = c.get('storeId');
  const instance = await createPdfInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  const { pdf, entry } = instance.right;

  if (newMeta.author) pdf.setAuthor(newMeta.author);
  if (newMeta.title) pdf.setTitle(newMeta.title);
  if (newMeta.keywords) pdf.setKeywords(newMeta.keywords);
  if (newMeta.subject) pdf.setSubject(newMeta.subject);

  const content = await pdf.save();
  const path = getFilePath(entry.value.isPublic, entry.value.index, entry.value.extension, storeId);

  await Bun.write(path, new Response(Uint8ArrayToStream(content)));
  return streamFile(c, { stream: () => Uint8ArrayToStream(content), type: 'application/pdf' });
};

export const addAttachmentHandler: RouteHandler<typeof addAttachmentRoute, AuthorizationBinding> = async (c) => {
  const { id, outputMethod, attachmentId, name, ...options } = c.req.valid('json');
  const storeId = c.get('storeId');

  if (id == attachmentId)
    return createCustomError(c, 'Attachment and pdf file  cannot be the same', 'id,attachmentId', 'invalid_arguments');

  const { '0': instance, '1': attachementEntry } = await Promise.all([
    createPdfInstance(c, storeId, id),
    getFileEntry(storeId, attachmentId),
  ]);

  if (instance._tag == 'Left' || attachementEntry._tag == 'None') return c.notFound();

  const { extension, index, isPublic } = attachementEntry.value;
  const attachementPath = getFilePath(isPublic, index, extension, storeId);
  const attachment = Bun.file(attachementPath);
  const arrayBuffer = await attachment.arrayBuffer();

  const { pdf } = instance.right;
  await pdf.attach(arrayBuffer, name, options);

  const content = await pdf.save();

  return handleTransformationOutput(c, storeId, Uint8ArrayToBuffer(content), '.pdf', outputMethod);
};
