import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-heavy-content',
  imports: [MatCardModule, MatIconModule],
  template: `
    <div class="heavy-box">
      <mat-icon class="icon">check_circle</mat-icon>
      <div class="content">
        <h4>Komponente bei Bedarf geladen (&#64;defer)!</h4>
        <p>
          Diese Komponente und ihr JavaScript-Code wurden erst heruntergeladen und instanziiert, als
          die Trigger-Bedingung erfüllt war.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .heavy-box {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background-color: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
        border-radius: 12px;
        animation: fadeIn 0.3s ease-in;

        .icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: var(--mat-sys-primary);
        }

        h4 {
          margin: 0 0 4px;
          font-size: 1rem;
        }

        p {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.9;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeavyContentComponent {}
