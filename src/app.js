import { fastifyInstrumentation } from './opentelemetry/fastify.js';
import fastifyRequestContext, {
  requestContext,
} from '@fastify/request-context';
import { v4 as uuid } from 'uuid';
import { fastify } from 'fastify';
import v1Router from './api/v1/index.js';
import { pick } from 'lodash-es';

/** @type {import('fastify').FastifyInstance & { getPort: () => number }} */
let server;

/** @type {import('@adsk/acscorr-cache-service/types/cache-service.js').CacheService} */
export let cacheService;

/** @param {number} port */

export async function initializeWebServer(port = 0) {
  server = Object.assign(
    fastify({
      genReqId: (request) =>
        /** @type {string} */ (request.headers['x-request-id']) || uuid(),
      ajv: {
        customOptions: {
          coerceTypes: true,
        },
      },
      bodyLimit: 5.5 * 1024 * 1000,
      logger: {
        level: 'info',
        timestamp: false,
        messageKey: 'message',
        formatters: {
          /**
           * @param {{
           *   req?: { id: string };
           *   res?: { request: { id: string }; statusCode: number };
           * }} log
           */
          log(log) {
            const request = log.req
              ? log.req
              : log.res
                ? log.res.request
                : undefined;
            const response = log.res;
            return {
              meta: {
                requestId: request?.id,
                executionId: request
                  ? requestContext.get('executionId')
                  : undefined,
                requestContext: request
                  ? {
                      ...pick(request, ['method', 'url', 'params', 'query']),
                      statusCode: response?.statusCode,
                    }
                  : undefined,
              },
            };
          },
          bindings: () => ({
            loggerId: 'fastify',
            timestamp: new Date().toISOString(),
          }),
          level: (label) => ({ level: label.toUpperCase() }),
        },
        serializers: {
          reqId: () => undefined,
        },
      },
    }),
    {
      getPort: () => {
        const address = server.server.address();
        return typeof address === 'string'
          ? Number(address)
          : address?.port || -1;
      },
    },
  );
  server.register(fastifyInstrumentation.plugin());

  // This register must be before all other registers and hooks
  server.register(fastifyRequestContext);

  server.addHook('onRequest', async (request, reply) => {
    request.requestContext.set('requestId', request.id);
    request.requestContext.set('executionId', uuid());
    request.requestContext.set('method', request.method);
    request.requestContext.set('url', request.url);
    request.requestContext.set(
      'params',
      /** @type {{ [key: string]: any }} */ (request.params),
    );

    console.log('Incoming Request');

    // Apigee X injects this header by default so this is just in case x-request-id will be missing
    reply.header('x-request-id', request.id);
  });
  server.addHook('onResponse', async (request, reply) => {
    request.requestContext.set('statusCode', reply.statusCode);
    console.log('Outgoing Response');
  });

  server.register(v1Router, { prefix: 'api/v1' });
  // server.register(fastifyInstrumentation.plugin());

  await server.listen({ port, host: '0.0.0.0' });

  return server;
}

export async function stopWebServer() {
  await server.close();
}
