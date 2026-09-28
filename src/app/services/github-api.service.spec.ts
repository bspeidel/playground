import { TestBed } from '@angular/core/testing';
import { GitHubApiService } from './github-api.service';

describe('GitHubApiService', () => {
  let service: GitHubApiService;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    service = TestBed.inject(GitHubApiService);
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function okResponse(body: unknown): Response {
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => body,
    } as Response;
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty result for a blank query without hitting the API', async () => {
    const result = await service.search({ query: '   ', sort: 'stars' });

    expect(result).toEqual({ total_count: 0, items: [] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should URL-encode the query and forward the sort and page size', async () => {
    fetchMock.mockResolvedValue(okResponse({ total_count: 0, items: [] }));

    await service.search({ query: 'angular signals', sort: 'forks' });

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('q=angular%20signals');
    expect(url).toContain('sort=forks');
    expect(url).toContain('per_page=9');
  });

  it('should forward the abort signal to fetch', async () => {
    fetchMock.mockResolvedValue(okResponse({ total_count: 0, items: [] }));
    const controller = new AbortController();

    await service.search({ query: 'angular', sort: 'stars' }, controller.signal);

    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal);
  });

  it('should surface a friendly message on rate limit (403 and 429)', async () => {
    for (const status of [403, 429]) {
      fetchMock.mockResolvedValue({
        ok: false,
        status,
        statusText: 'Forbidden',
      } as Response);

      await expect(service.search({ query: 'angular', sort: 'stars' })).rejects.toThrow(
        /Ratenlimit/,
      );
    }
  });

  it('should surface the status code for other failures', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(service.search({ query: 'angular', sort: 'stars' })).rejects.toThrow(
      /GitHub-Netzwerkfehler \(500\)/,
    );
  });

  it('should count aborted requests exactly once each', async () => {
    fetchMock.mockImplementation(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );

    const controller = new AbortController();
    const pending = service.search({ query: 'angular', sort: 'stars' }, controller.signal);

    expect(service.abortedCount()).toBe(0);

    controller.abort();
    await expect(pending).rejects.toThrow('aborted');

    expect(service.abortedCount()).toBe(1);

    // The listener is removed once the request settles, so a late abort on the
    // same signal must not double-count.
    controller.abort();
    expect(service.abortedCount()).toBe(1);
  });

  it('should not count an abort for requests completed without a signal', async () => {
    fetchMock.mockResolvedValue(okResponse({ total_count: 1, items: [] }));

    await service.search({ query: 'angular', sort: 'stars' });

    expect(service.abortedCount()).toBe(0);
  });
});
