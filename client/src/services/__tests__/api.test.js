import { api } from '../api';

describe('api service', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('makes a GET request with correct headers', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    const data = await api.get('/test-endpoint');
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.objectContaining({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(data).toEqual({ data: 'test' });
  });

  it('adds authorization header if token exists and request requires auth', async () => {
    window.localStorage.getItem.mockReturnValueOnce('fake-token');
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await api.get('/auth-endpoint');
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token',
        },
      })
    );
  });

  it('handles non-ok responses by throwing an error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not found' }),
    });

    await expect(api.get('/error')).rejects.toThrow('Not found');
  });

  it('handles network errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(api.get('/fail')).rejects.toThrow('Unable to connect to the server');
  });

  it('handles 204 No Content correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const data = await api.delete('/delete-endpoint');
    expect(data).toBeNull();
  });
});
