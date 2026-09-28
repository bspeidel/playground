import { Injectable, signal } from '@angular/core';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubSearchResponse {
  total_count: number;
  items: GitHubRepo[];
}

export type GitHubSort = 'stars' | 'forks' | 'updated';

export interface GitHubSearchParams {
  query: string;
  sort: GitHubSort;
}

const ENDPOINT = 'https://api.github.com/search/repositories';
const PER_PAGE = 9;

/**
 * Thin wrapper around the public GitHub search API.
 *
 * Responsibilities:
 * - URL construction & encoding
 * - Error normalisation (including the very low anonymous rate limit)
 * - Abort bookkeeping, kept OUT of the `resource()` loader so the loader stays pure
 */
@Injectable({ providedIn: 'root' })
export class GitHubApiService {
  /**
   * Number of in-flight requests that were cancelled because a newer
   * superseding request started. Exposed as a signal so the UI can display it,
   * but it is never written from inside a `resource()` loader.
   */
  private readonly _abortedCount = signal(0);
  readonly abortedCount = this._abortedCount.asReadonly();

  async search(
    params: GitHubSearchParams,
    abortSignal?: AbortSignal,
  ): Promise<GitHubSearchResponse> {
    const query = params.query.trim();

    if (!query) {
      return { total_count: 0, items: [] };
    }

    abortSignal?.addEventListener('abort', this.onAbort, { once: true });

    try {
      const url =
        `${ENDPOINT}?q=${encodeURIComponent(query)}` + `&sort=${params.sort}&per_page=${PER_PAGE}`;

      const response = await fetch(url, {
        signal: abortSignal,
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (!response.ok) {
        throw this.toError(response);
      }

      return (await response.json()) as GitHubSearchResponse;
    } finally {
      abortSignal?.removeEventListener('abort', this.onAbort);
    }
  }

  private readonly onAbort = (): void => {
    this._abortedCount.update((count) => count + 1);
  };

  private toError(response: Response): Error {
    // Anonymous GitHub search is limited to ~10 requests/minute.
    if (response.status === 403 || response.status === 429) {
      return new Error(
        'GitHub-API-Ratenlimit erreicht (Rate Limit). Bitte in Kürze erneut versuchen.',
      );
    }
    return new Error(`GitHub-Netzwerkfehler (${response.status}) : ${response.statusText}`);
  }
}
