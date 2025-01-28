/** @typedef {import('fastify').FastifyInstance} FastifyInstance */
import { HttpException } from './http-errors/http-exception.js';
import { BadRequestException } from './http-errors/bad-request.js';
import { InternalServerException } from './http-errors/internal-server-error.js';
import router from './router.js';
import { StatusCodes } from 'http-status-codes';
import { Type } from '@sinclair/typebox';

/** @param {FastifyInstance} server */
export default async (server) => {
  server.register(router, { prefix: '/project' });

  server.route({
    method: 'GET',
    url: '/health',
    schema: {
      tags: ['misc'],
      operationId: 'healthCheck',
      summary: 'Health',
      response: {
        [StatusCodes.OK]: Type.Object({
          db: Type.String(),
        }),
        [StatusCodes.INTERNAL_SERVER_ERROR]: Type.Object({}),
      },
    },
    handler: async () => {
      return {
        db: 'ok',
      };
    },
  });

  server.setErrorHandler(handleError);
};

/**
 * @param {any} error
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
function handleError(error, request, reply) {
  /** @type {HttpException} */
  let responseError;

  try {
    if (error.validation) {
      responseError = new BadRequestException(
        'malformedPayload',
        error.message,
      );
    } else if (error instanceof HttpException) {
      responseError = error;
    } else {
      responseError = new InternalServerException();
    }
  } catch (e) {
    responseError = new InternalServerException();
  }

  reply
    .status(responseError.statusCode)
    .type('application/json')
    .send(responseError.toResponseBody());
}
