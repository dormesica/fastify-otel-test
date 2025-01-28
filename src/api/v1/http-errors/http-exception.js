export class HttpException {
  /**
   * @param {number} statusCode
   * @param {{
   *   type: string;
   *   title: string;
   *   errorCode: string;
   *   detail?: string;
   * }} body
   */
  constructor(statusCode, body) {
    this.statusCode = statusCode;
    this.type = body.type;
    this.title = body.title;
    this.errorCode = body.errorCode;

    if (body.detail) {
      this.detail = body.detail;
    }
  }

  toResponseBody() {
    return {
      type: this.type,
      title: this.title,
      errorCode: this.errorCode,
      ...(this.detail ? { detail: this.detail } : {}),
    };
  }
}
