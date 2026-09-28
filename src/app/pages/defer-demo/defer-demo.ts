import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateHtmlPipe, TranslatePipe } from '../../i18n';
import { HeavyContentComponent } from './heavy-content';

@Component({
  selector: 'app-defer-demo',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    HeavyContentComponent,
    TranslatePipe,
    TranslateHtmlPipe,
  ],
  templateUrl: './defer-demo.html',
  styleUrl: './defer-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeferDemoPage {}
