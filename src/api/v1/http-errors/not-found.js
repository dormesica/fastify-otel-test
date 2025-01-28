import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { HttpException } from './http-exception.js';
export class NotFoundException extends HttpException {
  /**
   * @param {string} resourceId
   * @param {'resourceNotFound' | 'resourcesNotFound'} type
   */
  constructor(resourceId, type = 'resourceNotFound') {
    super(StatusCodes.NOT_FOUND, {
      type: 'NOT-FOUND-' + NotFoundTypes[type],
      title: getReasonPhrase(StatusCodes.NOT_FOUND),
      detail: `Resource ID: ${resourceId}`,
      errorCode: 'CORRESPONDENCE_SERVICE_NOT_FOUND',
    });
  }
}

export class MultipleNotFoundException extends NotFoundException {
  /** @param {string[]} resourceIds */
  constructor(resourceIds) {
    super(resourceIds.join(', '), 'resourcesNotFound');
  }
}

const NotFoundTypes = Object.freeze({
  resourceNotFound: '001',
  resourcesNotFound: '002',
});
