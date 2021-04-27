import { init } from '../server';

jest.spyOn(console, 'log').mockImplementation(jest.fn());

describe('server', () => {
  it('initialises as expected', () => {
    init();

    expect(console.log as jest.Mock).toHaveBeenCalledWith('Hello world');
  });
});
