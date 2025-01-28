import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { HttpException } from './http-exception.js';

export class InternalServerException extends HttpException {
  constructor() {
    super(StatusCodes.INTERNAL_SERVER_ERROR, {
      type: 'INTERNAL_SERVER_ERROR',
      title: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      errorCode: 'CORRESPONDENCE_SERVICE_ERROR',
    });
  }
}
