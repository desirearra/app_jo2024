import axios from 'axios';
import { getEvents } from './api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getEvents', () => {
  it('should fetch events from the API and return data', async () => {
    const mockData = [
      { id: '1', title: 'Event 1' },
      { id: '2', title: 'Event 2' },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    const result = await getEvents();
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/events');
  });
});
