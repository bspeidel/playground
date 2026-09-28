import { Component, inject, signal, resource, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import {
  GitHubApiService,
  type GitHubSearchResponse,
  type GitHubSort,
} from '../../services/github-api.service';

const EMPTY_RESULT: GitHubSearchResponse = { total_count: 0, items: [] };

/** Milliseconds to wait after the last keystroke before hitting the API. */
const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-api-explorer',
  imports: [
    DecimalPipe,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  templateUrl: './api-explorer.html',
  styleUrl: './api-explorer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiExplorerPage {
  private readonly githubApi = inject(GitHubApiService);

  /** Raw value bound to the search input; updated on every keystroke. */
  readonly searchInput = signal('angular');
  readonly selectedSort = signal<GitHubSort>('stars');

  /**
   * Debounced query actually driving the request. Without this, typing a
   * nine-character term would fire nine requests and exhaust the anonymous
   * GitHub rate limit (~10 requests/minute).
   */
  readonly searchTerm = toSignal(
    toObservable(this.searchInput).pipe(
      map((value) => value.trim()),
      distinctUntilChanged(),
      debounceTime(SEARCH_DEBOUNCE_MS),
    ),
    { initialValue: 'angular' },
  );

  readonly abortCount = this.githubApi.abortedCount;

  /** Exposed for display so the template never hardcodes the debounce window. */
  readonly debounceMs = SEARCH_DEBOUNCE_MS;

  readonly reposResource = resource({
    params: () => ({
      query: this.searchTerm(),
      sort: this.selectedSort(),
    }),
    defaultValue: EMPTY_RESULT,
    loader: ({ params, abortSignal }) => this.githubApi.search(params, abortSignal),
  });

  setSearch(query: string): void {
    this.searchInput.set(query);
  }
}
