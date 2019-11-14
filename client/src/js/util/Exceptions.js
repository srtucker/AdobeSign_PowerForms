'use strict';

export class APIException extends Error {
  constructor(apiData, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIException);
    }

    // Custom debugging information
    this.apiData = apiData
  }
}

export class HandledException extends Error {
  constructor(heading, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HandledException);
    }

    // Custom debugging information
    this.heading = heading
  }

  getTemplateVars() {
    return {
      heading: this.heading,
      errorBody: this.message,
    }
  }
}
