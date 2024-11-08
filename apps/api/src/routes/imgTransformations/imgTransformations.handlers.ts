import type { RouteHandler } from '@hono/zod-openapi';
import type {
  blurRoute,
  compressionRoute,
  contrastRoute,
  conversionRoute,
  grayscaleRoute,
  invertRoute,
  modulateRoute,
  resizeRoute,
  sepiaRoute,
  sharpenRoute,
} from './imgTransformation.dal';
import type { AuthorizationBinding } from '@shared/types.global';
import { createSharpInstance } from '@utils/utils.general';
import { handleTransformationOutput } from '@utils/utils.hono';
import { sepiaMatrix } from '@shared/const';

export const conversionHandler: RouteHandler<typeof conversionRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { id, targetFormat, outputMethod } = c.req.valid('json');

  const instance = await createSharpInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  let buffer: Buffer;
  switch (targetFormat) {
    case '.jpeg':
    case '.jpg':
      buffer = await instance.right.sharp.jpeg().toBuffer();
      break;
    case '.png':
      buffer = await instance.right.sharp.png().toBuffer();
      break;
    case '.webp':
      buffer = await instance.right.sharp.webp().toBuffer();
      break;
    case '.avif':
      buffer = await instance.right.sharp.avif().toBuffer();
      break;
    case '.tiff':
      buffer = await instance.right.sharp.tiff().toBuffer();
      break;
  }
  return await handleTransformationOutput(c, storeId, buffer, targetFormat, outputMethod);
};

export const resizeHandler: RouteHandler<typeof resizeRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { id, outputMethod, ...resizeOptions } = c.req.valid('json');

  const instance = await createSharpInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  const buffer = await instance.right.sharp.resize(resizeOptions).toBuffer();

  return await handleTransformationOutput(c, storeId, buffer, instance.right.entry.extension, outputMethod);
};

export const compressionHandler: RouteHandler<typeof compressionRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { id, outputMethod, quality } = c.req.valid('json');

  const instance = await createSharpInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  let buffer: Buffer = Buffer.from([]);
  switch (instance.right.entry.extension) {
    case '.jpeg':
    case '.jpg':
      buffer = await instance.right.sharp.jpeg({ quality }).toBuffer();
      break;
    case '.png':
      buffer = await instance.right.sharp.png({ quality }).toBuffer();
      break;
    case '.webp':
      buffer = await instance.right.sharp.webp({ quality }).toBuffer();
      break;
    case '.avif':
      buffer = await instance.right.sharp.avif({ quality }).toBuffer();
      break;
    case '.tiff':
      buffer = await instance.right.sharp.tiff({ quality }).toBuffer();
      break;
  }

  return await handleTransformationOutput(c, storeId, buffer, instance.right.entry.extension, outputMethod);
};

export const blurHandler: RouteHandler<typeof blurRoute, AuthorizationBinding> = async (c) => {
  const { sigma, outputMethod, id } = c.req.valid('json');
  const storeId = c.get('storeId');

  const instance = await createSharpInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  const buffer = await instance.right.sharp.blur(sigma).toBuffer();

  return await handleTransformationOutput(c, storeId, buffer, instance.right.entry.extension, outputMethod);
};

export const sharpenHandler: RouteHandler<typeof sharpenRoute, AuthorizationBinding> = async (c) => {
  const { sigma, outputMethod, id } = c.req.valid('json');
  const storeId = c.get('storeId');

  const instance = await createSharpInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  const buffer = await instance.right.sharp.sharpen({ sigma }).toBuffer();

  return await handleTransformationOutput(c, storeId, buffer, instance.right.entry.extension, outputMethod);
};

export const modulateHandler: RouteHandler<typeof modulateRoute, AuthorizationBinding> = async (c) => {
  const { outputMethod, id, ...modulateOptions } = c.req.valid('json');
  const storeId = c.get('storeId');

  const instance = await createSharpInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  const buffer = await instance.right.sharp.modulate(modulateOptions).toBuffer();

  return await handleTransformationOutput(c, storeId, buffer, instance.right.entry.extension, outputMethod);
};

export const sepiaHandler: RouteHandler<typeof sepiaRoute, AuthorizationBinding> = async (c) => {
  const { outputMethod, id } = c.req.valid('json');
  const storeId = c.get('storeId');

  const instance = await createSharpInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  const buffer = await instance.right.sharp.recomb(sepiaMatrix).toBuffer();

  return await handleTransformationOutput(c, storeId, buffer, instance.right.entry.extension, outputMethod);
};

export const grayscaleHandler: RouteHandler<typeof grayscaleRoute, AuthorizationBinding> = async (c) => {
  const { outputMethod, id } = c.req.valid('json');
  const storeId = c.get('storeId');

  const instance = await createSharpInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  const buffer = await instance.right.sharp.grayscale().toBuffer();

  return await handleTransformationOutput(c, storeId, buffer, instance.right.entry.extension, outputMethod);
};

export const invertHandler: RouteHandler<typeof invertRoute, AuthorizationBinding> = async (c) => {
  const { outputMethod, id } = c.req.valid('json');
  const storeId = c.get('storeId');

  const instance = await createSharpInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  const buffer = await instance.right.sharp.negate().toBuffer();

  return await handleTransformationOutput(c, storeId, buffer, instance.right.entry.extension, outputMethod);
};

export const contrastHandler: RouteHandler<typeof contrastRoute, AuthorizationBinding> = async (c) => {
  const { outputMethod, id, ...contrastOptions } = c.req.valid('json');
  const storeId = c.get('storeId');

  const instance = await createSharpInstance(c, storeId, id);

  if (instance._tag == 'Left') return instance.left;

  const buffer = await instance.right.sharp.normalise(contrastOptions).toBuffer();

  return await handleTransformationOutput(c, storeId, buffer, instance.right.entry.extension, outputMethod);
};
