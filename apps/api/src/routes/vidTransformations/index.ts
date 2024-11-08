import { OpenAPIHono } from '@hono/zod-openapi';
import { zodHook } from '@middlewares/zodHook';
import { addSubtitleRoute, changeResolutionRoute, convertFormatRoute, extractAudioRoute, trimRoute } from './vidTransformations.dal';
import {
  addSubtitlesHandler,
  changeResolutionHandler,
  convertFormatHandler,
  extractAudioHandler,
  trimHandler,
} from './vidTransformations.handlers';

const route = new OpenAPIHono({ defaultHook: zodHook });

route.openapi(extractAudioRoute, extractAudioHandler);

route.openapi(trimRoute, trimHandler);

route.openapi(changeResolutionRoute, changeResolutionHandler);

route.openapi(addSubtitleRoute, addSubtitlesHandler);

route.openapi(convertFormatRoute, convertFormatHandler);

export default route;
