export class DatabaseException extends Error {
  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseException);
    }

    this.name = this.constructor.name;
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedException);
    }

    this.name = this.constructor.name;
  }
}

export class ForbiddenException extends Error {
  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ForbiddenException);
    }

    this.name = this.constructor.name;
  }
}
