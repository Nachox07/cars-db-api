jest.mock('../src/logger');

export const mockCarAggregateExec = jest.fn();
export const mockCarConstructor = jest.fn();
export const mockCarFindByIdAndDelete = jest.fn();
export const mockCarFindByIdAndUpdate = jest.fn();
export const mockCarFindById = jest.fn();
export const mockCarSave = jest.fn();

class MongooseModelMock {
  constructor(obj: any) {
    mockCarConstructor(obj);
    return {
      save: mockCarSave,
    };
  }

  static aggregate() {
    return {
      exec: mockCarAggregateExec,
    };
  }

  static findById(id: string) {
    return mockCarFindById(id);
  }

  static findByIdAndDelete(id: string) {
    return mockCarFindByIdAndDelete(id);
  }

  static findByIdAndUpdate(id: string) {
    return mockCarFindByIdAndUpdate(id);
  }
}

jest.mock('../src/models/car.model', () => ({
  Car: MongooseModelMock,
}));
