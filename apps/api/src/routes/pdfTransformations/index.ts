import { OpenAPIHono } from '@hono/zod-openapi';
import { zodHook } from '@middlewares/zodHook';
import { addAttachmentRoute, extractPagesRoute, mergeRoute, readMetaRoute, setMetaRoute } from './pdfTransformations.dal';
import { mergeHandler, extractPagesHandler, readMetaHandler, setMetaHandler, addAttachmentHandler } from './pdfTransformations.handlers';

const route = new OpenAPIHono({ defaultHook: zodHook });

route.openapi(mergeRoute, mergeHandler);

route.openapi(extractPagesRoute, extractPagesHandler);

route.openapi(readMetaRoute, readMetaHandler);

route.openapi(setMetaRoute, setMetaHandler);

route.openapi(addAttachmentRoute, addAttachmentHandler);

export default route;
