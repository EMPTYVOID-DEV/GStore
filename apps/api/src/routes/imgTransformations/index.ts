import { OpenAPIHono } from '@hono/zod-openapi';
import { zodHook } from '@middlewares/zodHook';
import {
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
import {
  blurHandler,
  compressionHandler,
  contrastHandler,
  conversionHandler,
  grayscaleHandler,
  invertHandler,
  modulateHandler,
  resizeHandler,
  sepiaHandler,
  sharpenHandler,
} from './imgTransformations.handlers';

const route = new OpenAPIHono({ defaultHook: zodHook });

route.openapi(conversionRoute, conversionHandler);

route.openapi(resizeRoute, resizeHandler);

route.openapi(compressionRoute, compressionHandler);

route.openapi(blurRoute, blurHandler);

route.openapi(sharpenRoute, sharpenHandler);

route.openapi(modulateRoute, modulateHandler);

route.openapi(sepiaRoute, sepiaHandler);

route.openapi(grayscaleRoute, grayscaleHandler);

route.openapi(invertRoute, invertHandler);

route.openapi(contrastRoute, contrastHandler);

export default route;
