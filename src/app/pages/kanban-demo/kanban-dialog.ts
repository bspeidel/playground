import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  priority: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  assignee: { name: string; initials: string; color: string };
  tags: string[];
  createdAt: Date;
}

export interface KanbanDialogData {
  task?: KanbanTask;
  columnId?: string;
}

@Component({
  selector: 'app-kanban-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="dialog-icon">{{ data?.task ? 'edit' : 'add_task' }}</mat-icon>
      {{ data?.task ? 'Aufgabe bearbeiten' : 'Neue Aufgabe' }}
    </h2>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="kanban-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Aufgabentitel</mat-label>
          <input matInput formControlName="title" placeholder="Z. B.: Auth-Komponente entwickeln" />
          <mat-icon matPrefix>title</mat-icon>
          @if (form.get('title')?.hasError('required')) {
            <mat-error>Der Titel ist erforderlich</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Detaillierte Beschreibung</mat-label>
          <textarea
            matInput
            rows="3"
            formControlName="description"
            placeholder="Details, Akzeptanzkriterien..."
          ></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Priorität</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="Basse">Niedrig</mat-option>
              <mat-option value="Moyenne">Mittel</mat-option>
              <mat-option value="Haute">Hoch</mat-option>
              <mat-option value="Critique">Kritisch</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Zugewiesen an</mat-label>
            <mat-select formControlName="assigneeIndex">
              @for (member of teamMembers; track member.name; let i = $index) {
                <mat-option [value]="i">{{ member.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tags (kommagetrennt)</mat-label>
          <input matInput formControlName="tags" placeholder="Z. B.: Frontend, Signals, UI" />
          <mat-icon matPrefix>label</mat-icon>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="cancel()">Abbrechen</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">
        {{ data?.task ? 'Speichern' : 'Aufgabe erstellen' }}
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
        padding-top: 12px !important;
      }
      .kanban-form {
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
      .dialog-actions {
        padding: 16px 24px;
      }
    `,
  ],
})
export class KanbanDialog {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<KanbanDialog>);
  readonly data = inject<KanbanDialogData | null>(MAT_DIALOG_DATA, { optional: true });

  readonly teamMembers = [
    { name: 'Benjamin S.', initials: 'BS', color: '#2563eb' },
    { name: 'Sophie Martin', initials: 'SM', color: '#7c3aed' },
    { name: 'Alexandre Roy', initials: 'AR', color: '#059669' },
    { name: 'Camille Leroy', initials: 'CL', color: '#ea580c' },
  ];

  readonly form = this.fb.group({
    title: [this.data?.task?.title ?? '', [Validators.required, Validators.minLength(3)]],
    description: [this.data?.task?.description ?? ''],
    priority: [this.data?.task?.priority ?? 'Moyenne', Validators.required],
    assigneeIndex: [0, Validators.required],
    tags: [this.data?.task?.tags.join(', ') ?? 'Angular 22, UI'],
  });

  constructor() {
    if (this.data?.task) {
      const idx = this.teamMembers.findIndex((m) => m.name === this.data?.task?.assignee.name);
      if (idx !== -1) {
        this.form.patchValue({ assigneeIndex: idx });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const val = this.form.getRawValue();
      const member = this.teamMembers[val.assigneeIndex ?? 0];
      const tagsArray = (val.tags ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const result: KanbanTask = {
        id: this.data?.task?.id ?? `TSK-${Math.floor(100 + Math.random() * 900)}`,
        title: val.title!,
        description: val.description || 'Keine Beschreibung angegeben.',
        priority: val.priority! as KanbanTask['priority'],
        assignee: member,
        tags: tagsArray.length > 0 ? tagsArray : ['Allgemein'],
        createdAt: this.data?.task?.createdAt ?? new Date(),
      };

      this.dialogRef.close(result);
    }
  }
}
