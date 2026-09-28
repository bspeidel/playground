import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';

interface Feature {
  icon: string;
  link: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  tagKey: TranslationKey;
}

@Component({
  selector: 'app-overview',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    TranslatePipe,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  readonly features: readonly Feature[] = [
    {
      icon: 'bolt',
      link: '/signals',
      titleKey: 'overview.feature.core.title',
      descriptionKey: 'overview.feature.core.description',
      tagKey: 'overview.feature.core.tag',
    },
    {
      icon: 'palette',
      link: '/material',
      titleKey: 'overview.feature.material.title',
      descriptionKey: 'overview.feature.material.description',
      tagKey: 'overview.feature.material.tag',
    },
    {
      icon: 'hourglass_empty',
      link: '/defer',
      titleKey: 'overview.feature.defer.title',
      descriptionKey: 'overview.feature.defer.description',
      tagKey: 'overview.feature.defer.tag',
    },
    {
      icon: 'public',
      link: '/api-explorer',
      titleKey: 'overview.feature.api.title',
      descriptionKey: 'overview.feature.api.description',
      tagKey: 'overview.feature.api.tag',
    },
    {
      icon: 'table_chart',
      link: '/table',
      titleKey: 'overview.feature.table.title',
      descriptionKey: 'overview.feature.table.description',
      tagKey: 'overview.feature.table.tag',
    },
    {
      icon: 'view_kanban',
      link: '/kanban',
      titleKey: 'overview.feature.kanban.title',
      descriptionKey: 'overview.feature.kanban.description',
      tagKey: 'overview.feature.kanban.tag',
    },
    {
      icon: 'dynamic_form',
      link: '/forms',
      titleKey: 'overview.feature.forms.title',
      descriptionKey: 'overview.feature.forms.description',
      tagKey: 'overview.feature.forms.tag',
    },
    {
      icon: 'speed',
      link: '/virtual-scroll',
      titleKey: 'overview.feature.virtualScroll.title',
      descriptionKey: 'overview.feature.virtualScroll.description',
      tagKey: 'overview.feature.virtualScroll.tag',
    },
    {
      icon: 'insights',
      link: '/charts',
      titleKey: 'overview.feature.charts.title',
      descriptionKey: 'overview.feature.charts.description',
      tagKey: 'overview.feature.charts.tag',
    },
    {
      icon: 'rocket_launch',
      link: '/stepper',
      titleKey: 'overview.feature.stepper.title',
      descriptionKey: 'overview.feature.stepper.description',
      tagKey: 'overview.feature.stepper.tag',
    },
    {
      icon: 'folder_open',
      link: '/tree',
      titleKey: 'overview.feature.tree.title',
      descriptionKey: 'overview.feature.tree.description',
      tagKey: 'overview.feature.tree.tag',
    },
  ];
}
