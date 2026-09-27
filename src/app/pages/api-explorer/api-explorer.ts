import { Component, signal, resource, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

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

@Component({
  selector: 'app-api-explorer',
  imports: [
    CommonModule,
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
  readonly searchTerm = signal('angular');
  readonly selectedSort = signal<'stars' | 'forks' | 'updated'>('stars');
  readonly abortCount = signal(0);

  readonly reposResource = resource({
    params: () => ({
      query: this.searchTerm().trim(),
      sort: this.selectedSort(),
    }),
    defaultValue: { total_count: 0, items: [] } as GitHubSearchResponse,
    loader: async ({ params, abortSignal }) => {
      if (!params.query) {
        return { total_count: 0, items: [] };
      }

      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
        params.query,
      )}&sort=${params.sort}&per_page=9`;

      abortSignal.addEventListener('abort', () => {
        this.abortCount.update((c) => c + 1);
      });

      const response = await fetch(url, {
        signal: abortSignal,
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            'GitHub-API-Ratenlimit erreicht (Rate Limit). Bitte versuchen Sie es in Kürze erneut.',
          );
        }
        throw new Error(`GitHub-Netzwerkfehler (${response.status}) : ${response.statusText}`);
      }

      return (await response.json()) as GitHubSearchResponse;
    },
  });

  setSearch(query: string) {
    this.searchTerm.set(query);
  }
}
