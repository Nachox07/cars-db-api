// eslint-disable-next-line import/prefer-default-export
export const useTimeMock = (timestamp: string): void => {
  const OriginalDate = Date;

  class DateMock extends Date {
    constructor(dt: any = timestamp) {
      super();
      return new OriginalDate(dt);
    }
  }

  // eslint-disable-next-line no-global-assign
  Date = DateMock as DateConstructor;
};
