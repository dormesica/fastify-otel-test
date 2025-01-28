import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { HttpException } from './http-exception.js';

/** @typedef {keyof BadRequestTypes} BadRequestType */
export class BadRequestException extends HttpException {
  /**
   * @param {BadRequestType} type
   * @param {string} detail
   */
  constructor(type, detail) {
    super(StatusCodes.BAD_REQUEST, {
      type: 'BAD-REQUEST-' + BadRequestTypes[type],
      title: getReasonPhrase(StatusCodes.BAD_REQUEST),
      detail,
      errorCode: ErrorCodes[type],
    });
  }
}

const BadRequestTypes = Object.freeze({
  malformedPayload: '001',
  invalidRecipients: '002',
  invalidType: '003',
  gcorTypeCannotBeChanged: '004',
  contentSizeExceeded: '005',
});

/** @type {Record<BadRequestType, string>} */
const ErrorCodes = Object.freeze({
  malformedPayload: 'CORRESPONDENCE_SERVICE_BAD_REQUEST',
  invalidRecipients: 'CORRESPONDENCE_SERVICE_BAD_REQUEST_INVALID_RECIPIENT',
  invalidType: 'CORRESPONDENCE_SERVICE_BAD_REQUEST_INVALID_TYPE',
  gcorTypeCannotBeChanged: 'CORRESPONDENCE_SERVICE_BAD_REQUEST_TYPE_CHANGE',
  contentSizeExceeded: 'CORRESPONDENCE_SERVICE_BAD_REQUEST_CONTENT_SIZE',
});
