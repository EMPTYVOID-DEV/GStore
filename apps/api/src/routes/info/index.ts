import { OpenAPIHono } from '@hono/zod-openapi';
import { zodHook } from '@middlewares/zodHook';
import { apiInfoRoute, keyInfoRoute } from './info.dal';
import { apiInfoHandler, keyInfoHandler } from './info.handlers';

const router = new OpenAPIHono({ defaultHook: zodHook });

router.openapi(apiInfoRoute, apiInfoHandler);

router.openapi(keyInfoRoute, keyInfoHandler);

export default router;
