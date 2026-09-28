import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';

/**
 * Fallback tag for tasks created without one. Deliberately a plain constant
 * rather than a translated call: tags are data, the search box matches on them,
 * and freezing a locale into them would make the tag stick.
 */
const DEFAULT_TAG = 'Allgemein';

export interface KanbanTask {
  id: string;
  /**
   * Raw German text. Kept verbatim because `filteredTasks` matches the search
   * box against it; the display uses `titleKey` when present.
   */
  title: string;
  description: string;
  /**
   * Display-layer translation keys for the seed tasks. `null` for tasks the
   * user creates through the dialog, whose text has no translation.
   */
  titleKey?: TranslationKey | null;
  descriptionKey?: TranslationKey | null;
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
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="dialog-icon">{{ data?.task ? 'edit' : 'add_task' }}</mat-icon>
      {{ (data?.task ? 'kanban.dialog.editTitle' : 'kanban.dialog.createTitle') | t }}
    </h2>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="kanban-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'kanban.dialog.titleLabel' | t }}</mat-label>
          <input
            matInput
            formControlName="title"
            [placeholder]="'kanban.dialog.titlePlaceholder' | t"
          />
          <mat-icon matPrefix>title</mat-icon>
          @if (form.get('title')?.hasError('required')) {
            <mat-error>{{ 'kanban.dialog.titleRequired' | t }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'kanban.dialog.descriptionLabel' | t }}</mat-label>
          <textarea
            matInput
            rows="3"
            formControlName="description"
            [placeholder]="'kanban.dialog.descriptionPlaceholder' | t"
          ></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>{{ 'kanban.priority.label' | t }}</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="Basse">{{ 'kanban.priority.low' | t }}</mat-option>
              <mat-option value="Moyenne">{{ 'kanban.priority.medium' | t }}</mat-option>
              <mat-option value="Haute">{{ 'kanban.priority.high' | t }}</mat-option>
              <mat-option value="Critique">{{ 'kanban.priority.critical' | t }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>{{ 'kanban.dialog.assigneeLabel' | t }}</mat-label>
            <mat-select formControlName="assigneeIndex">
              @for (member of teamMembers; track member.name; let i = $index) {
                <mat-option [value]="i">{{ member.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'kanban.dialog.tagsLabel' | t }}</mat-label>
          <input
            matInput
            formControlName="tags"
            [placeholder]="'kanban.dialog.tagsPlaceholder' | t"
          />
          <mat-icon matPrefix>label</mat-icon>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="cancel()">{{ 'kanban.action.cancel' | t }}</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">
        {{ (data?.task ? 'kanban.dialog.save' : 'kanban.dialog.create') | t }}
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
  private readonly translate = inject(TranslateService);
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

      const original = this.data?.task;
      const title = val.title!.trim();
      const description = (val.description ?? '').trim();

      // A translation key is only still valid if the text behind it is
      // unchanged. If the user edited the field, the key would now point at a
      // string the task no longer holds, so it is dropped and the raw text
      // takes over.
      const titleKey = original && original.title === title ? (original.titleKey ?? null) : null;

      // An empty description is stored as an empty string plus a key, rather
      // than baking the active locale's placeholder into the task data — that
      // text would otherwise stay frozen in whichever language was active
      // when the task happened to be created.
      const descriptionKey = !description
        ? ('kanban.dialog.defaultDescription' as const)
        : original && original.description === description
          ? (original.descriptionKey ?? null)
          : null;

      const result: KanbanTask = {
        id: original?.id ?? `TSK-${Math.floor(100 + Math.random() * 900)}`,
        title,
        description,
        titleKey,
        descriptionKey,
        priority: val.priority! as KanbanTask['priority'],
        assignee: member,
        tags: tagsArray.length > 0 ? tagsArray : [DEFAULT_TAG],
        createdAt: original?.createdAt ?? new Date(),
      };

      this.dialogRef.close(result);
    }
  }
}
