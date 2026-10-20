import { createClient } from '../client';

describe('hcloud client', () => {
  it('sends bearer token and parses json', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ servers: [] }),
    });
    const client = createClient('tok', fetchMock as any);
    const res = await client.get('/servers');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.hetzner.cloud/v1/servers',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer tok' }) }),
    );
    expect(res).toEqual({ servers: [] });
  });

  it('throws HetznerError on 401', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { code: 'unauthorized', message: 'bad token' } }),
    });
    const client = createClient('tok', fetchMock as any);
    await expect(client.get('/servers')).rejects.toMatchObject({ status: 401, code: 'unauthorized' });
  });
});
