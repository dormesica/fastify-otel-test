import { NotFoundException } from './http-errors/not-found.js';
import { StatusCodes } from 'http-status-codes';
import { Type } from '@sinclair/typebox';

export default async (server) => {
  server.route({
    method: 'GET',
    url: '/test',
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
      return 'test';
    },
  });

  server.addHook('preHandler', () => {
    throw new NotFoundException();
  });
};