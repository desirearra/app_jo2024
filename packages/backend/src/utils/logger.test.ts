import { logger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('log info', () => {
    logger.info('Hello info', 123);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[INFO\] \[.*\]/),
      'Hello info',
      123
    );
  });

  it('log warn', () => {
    logger.warn('Attention', 'foo');
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/\[WARN\] \[.*\]/),
      'Attention',
      'foo'
    );
  });

  it('log error', () => {
    logger.error('Erreur', { code: 500 });
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/\[ERROR\] \[.*\]/),
      'Erreur',
      { code: 500 }
    );
  });
});
