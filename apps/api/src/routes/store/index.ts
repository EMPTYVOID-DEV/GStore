import { OpenAPIHono } from '@hono/zod-openapi';
import { zodHook } from '@middlewares/zodHook';
import { createStoreRoute, deleteStoreRoute } from './store.dal';
import { createStoreHandler, deleteStoreHandler } from './store.handlers';

const route = new OpenAPIHono({ defaultHook: zodHook });

route.openapi(createStoreRoute, createStoreHandler);

route.openapi(deleteStoreRoute, deleteStoreHandler);

export default route;
