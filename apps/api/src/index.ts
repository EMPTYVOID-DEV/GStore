import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { readStaticRoute } from '@routes/files/files.dal';
import { readStaticHandler } from '@routes/files/files.handlers';
import { apiReference } from '@scalar/hono-api-reference';
import limiter from '@middlewares/rateLimiter';
import filesRoute from '@routes/files/index';
import imgTransformationRoute from '@routes/imgTransformations/index';
import pdfTransformationRoute from '@routes/pdfTransformations/index';
import vidTransformations from '@routes/vidTransformations/index';
import infoRoute from '@routes/info/index';
import { writeToLog } from '@utils/utils.general';
import storesRoute from '@routes/store/index';
import { envSchema } from '@shared/schema.global';

envSchema.parse(process.env);

const port = process.env.PORT;

const app = new OpenAPIHono();

app.use(limiter);

app.use(
  logger((...rest) => {
    console.log(rest.join(''));
    const message = rest.join(' ').replace(/\[\d{1,2}m/g, '');
    writeToLog(message, 'REQUEST');
  }),
);

app.openapi(readStaticRoute, readStaticHandler);

app.route('/stores', storesRoute);

app.route('/files', filesRoute);

app.route('/transformation/images', imgTransformationRoute);

app.route('/transformation/pdf', pdfTransformationRoute);

app.route('/transformation/videos', vidTransformations);

app.route('/info', infoRoute);

app.get('/', (c) => {
  return c.redirect('/ui-docs', 303);
});

app.doc('/json-docs', {
  info: {
    version: '*',
    title: 'g-store api',
    description: 'External api to handle store management for g-store',
  },
  openapi: '3.0.0',
});

app.get(
  '/ui-docs',
  apiReference({
    theme: 'purple',
    pageTitle: '@gstore/api',
    layout: 'modern',
    defaultHttpClient: {
      targetKey: 'node',
      clientKey: 'fetch',
    },
    spec: {
      url: '/json-docs',
    },
  }),
);

app.onError((err, c) => {
  writeToLog(err.message, 'ERROR');
  return c.text('Service Unavailable', 500);
});

export default {
  port: port,
  fetch: app.fetch,
};
