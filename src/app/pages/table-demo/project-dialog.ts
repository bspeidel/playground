import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

export interface ProjectItem {
  id: string;
  name: string;
  client: string;
  category: 'Web App' | 'Mobile App' | 'Cloud / DevOps' | 'Design System' | 'Audit AI';
  status: 'Actif' | 'En attente' | 'Terminé' | 'Bloqué';
  priority: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  budget: number;
  progress: number;
  dueDate: Date;
}

@Component({
  selector: 'app-project-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="dialog-icon">{{ data ? 'edit' : 'add_circle' }}</mat-icon>
      {{ data ? 'Modifier le projet' : 'Nouveau projet' }}
    </h2>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="project-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom du projet</mat-label>
          <input matInput formControlName="name" placeholder="Ex: Refonte Dashboard V3" />
          <mat-icon matPrefix>folder</mat-icon>
          @if (form.get('name')?.hasError('required')) {
            <mat-error>Le nom est requis</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Client / Entreprise</mat-label>
          <input matInput formControlName="client" placeholder="Ex: Acme Corp" />
          <mat-icon matPrefix>business</mat-icon>
          @if (form.get('client')?.hasError('required')) {
            <mat-error>Le client est requis</mat-error>
          }
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Catégorie</mat-label>
            <mat-select formControlName="category">
              <mat-option value="Web App">Web App</mat-option>
              <mat-option value="Mobile App">Mobile App</mat-option>
              <mat-option value="Cloud / DevOps">Cloud / DevOps</mat-option>
              <mat-option value="Design System">Design System</mat-option>
              <mat-option value="Audit AI">Audit AI</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Priorité</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="Basse">Basse</mat-option>
              <mat-option value="Moyenne">Moyenne</mat-option>
              <mat-option value="Haute">Haute</mat-option>
              <mat-option value="Critique">Critique</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Statut</mat-label>
            <mat-select formControlName="status">
              <mat-option value="Actif">Actif</mat-option>
              <mat-option value="En attente">En attente</mat-option>
              <mat-option value="Terminé">Terminé</mat-option>
              <mat-option value="Bloqué">Bloqué</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Budget (€)</mat-label>
            <input matInput type="number" formControlName="budget" min="0" step="500" />
            <mat-icon matPrefix>payments</mat-icon>
          </mat-form-field>
        </div>

        <div class="slider-field">
          <label for="project-progress" class="slider-label">
            Progression : {{ form.get('progress')?.value }}%
          </label>
          <mat-slider min="0" max="100" step="5" discrete>
            <input id="project-progress" matSliderThumb formControlName="progress" />
          </mat-slider>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="cancel()">Annuler</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">
        {{ data ? 'Mettre à jour' : 'Créer le projet' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-icon {
        vertical-align: middle;
        margin-right: 8px;
        color: var(--mat-sys-primary);
      }
      .dialog-content {
        min-width: 320px;
        max-width: 500px;
        padding-top: 16px !important;
      }
      .project-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .full-width {
        width: 100%;
      }
      .form-row {
        display: flex;
        gap: 16px;
      }
      .half-width {
        flex: 1;
      }
      .slider-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 8px 0;
      }
      .slider-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--mat-sys-on-surface-variant);
      }
      .dialog-actions {
        padding: 16px 24px;
      }
    `,
  ],
})
export class ProjectDialog {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<ProjectDialog>);
  readonly data = inject<ProjectItem | null>(MAT_DIALOG_DATA, { optional: true });

  readonly form = this.fb.group({
    name: [this.data?.name ?? '', [Validators.required, Validators.minLength(3)]],
    client: [this.data?.client ?? '', Validators.required],
    category: [this.data?.category ?? 'Web App', Validators.required],
    status: [this.data?.status ?? 'Actif', Validators.required],
    priority: [this.data?.priority ?? 'Moyenne', Validators.required],
    budget: [this.data?.budget ?? 15000, [Validators.required, Validators.min(0)]],
    progress: [
      this.data?.progress ?? 25,
      [Validators.required, Validators.min(0), Validators.max(100)],
    ],
  });

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const val = this.form.getRawValue();
      const result: ProjectItem = {
        id: this.data?.id ?? `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
        name: val.name!,
        client: val.client!,
        category: val.category! as ProjectItem['category'],
        status: val.status! as ProjectItem['status'],
        priority: val.priority! as ProjectItem['priority'],
        budget: Number(val.budget),
        progress: Number(val.progress),
        dueDate: this.data?.dueDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      this.dialogRef.close(result);
    }
  }
}
