import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HeavyContentComponent } from './heavy-content';

@Component({
  selector: 'app-defer-demo',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    HeavyContentComponent,
  ],
  templateUrl: './defer-demo.html',
  styleUrl: './defer-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeferDemoPage {}
