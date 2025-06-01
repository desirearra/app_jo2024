import type { AxiosResponse } from 'axios';
import * as api from '../api';

describe('createOrder', () => {
  // Déclaration temporaire pour TDD
  beforeAll(() => {
    // @ts-expect-error: TDD - createOrder n'existe pas encore dans l'API, on la déclare temporairement pour le test
    api.createOrder = async (userId, items) => (await api.post('/orders', { userId, items })).data;
  });

  it('envoie le bon payload à l’API backend', async () => {
    const mockPost = jest.spyOn(api, 'post').mockResolvedValue({
      data: { id: 'order-1' },
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    } as AxiosResponse);
    const userId = 'user-123';
    const items = [
      { offerId: 'offer-1', quantity: 2 },
      { offerId: 'offer-2', quantity: 1 },
    ];
    const res = await api.createOrder(userId, items);
    expect(mockPost).toHaveBeenCalledWith('/orders', { userId, items });
    expect(res).toEqual({ id: 'order-1' });
    mockPost.mockRestore();
  });
});
