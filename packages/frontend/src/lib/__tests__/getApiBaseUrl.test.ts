import { getApiBaseUrl } from '../getApiBaseUrl';

describe('getApiBaseUrl', () => {
  it('retourne la variable VITE_API_URL si process.env est défini', () => {
    process.env.VITE_API_URL = 'http://test-from-process:1234';
    expect(getApiBaseUrl()).toBe('http://test-from-process:1234');
    delete process.env.VITE_API_URL;
  });

  it("retourne la valeur par défaut si aucune variable n'est définie", () => {
    expect(getApiBaseUrl()).toBe('http://localhost:3000');
  });
});
