import { OpenAPIHono } from '@hono/zod-openapi';
import { createFileRoute, deleteFileRoute, listStoreFilesRoute, readTagsRoute, readFileRoute, updateFileRoute } from './files.dal';
import {
  createFileHandler,
  deleteFileHandler,
  listStoreFilesHandler,
  readTagsHandler,
  readFileHandler,
  updateFileHandler,
} from './files.handlers';
import { zodHook } from '@middlewares/zodHook';

const route = new OpenAPIHono({ defaultHook: zodHook });

route.openapi(readFileRoute, readFileHandler);

route.openapi(readTagsRoute, readTagsHandler);

route.openapi(createFileRoute, createFileHandler);

route.openapi(listStoreFilesRoute, listStoreFilesHandler);

route.openapi(deleteFileRoute, deleteFileHandler);

route.openapi(updateFileRoute, updateFileHandler);

export default route;
