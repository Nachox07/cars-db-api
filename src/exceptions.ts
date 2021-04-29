// eslint-disable-next-line import/prefer-default-export
export class DatabaseException extends Error {
  constructor(message: string, stack?: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseException);
    }

    this.name = 'DatabaseException';
    this.stack = stack;
  }
}
