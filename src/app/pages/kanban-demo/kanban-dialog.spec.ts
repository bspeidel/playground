import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KanbanDialog, type KanbanTask } from './kanban-dialog';
import { FR, TranslateService } from '../../i18n';

const SEED_TASK: KanbanTask = {
  id: 'TSK-101',
  title: 'WebGPU-Shader in Canvas evaluieren',
  description: 'Browser-Kompatibilität und 3D-Rendering-Gewinn prüfen.',
  titleKey: 'kanban.seed.101.title',
  descriptionKey: 'kanban.seed.101.description',
  priority: 'Basse',
  assignee: { name: 'Benjamin S.', initials: 'BS', color: '#2563eb' },
  tags: ['F&E', 'Grafik'],
  createdAt: new Date('2026-09-20'),
};

describe('KanbanDialog', () => {
  let close: jest.Mock;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('lang');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('lang');
  });

  function setup(task: KanbanTask | null = null): KanbanDialog {
    close = jest.fn();
    TestBed.configureTestingModule({
      imports: [KanbanDialog],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: task ? { task } : null },
      ],
    });
    return TestBed.runInInjectionContext(() => new KanbanDialog());
  }

  const result = (): KanbanTask => close.mock.calls[0][0] as KanbanTask;

  describe('existing task', () => {
    it('should prefill the form from the task', () => {
      const dialog = setup(SEED_TASK);
      expect(dialog.form.get('title')?.value).toBe(SEED_TASK.title);
      expect(dialog.form.get('description')?.value).toBe(SEED_TASK.description);
    });

    it('should keep the translation keys when the text is untouched', () => {
      const dialog = setup(SEED_TASK);
      dialog.save();

      const saved = result();
      expect(saved.id).toBe(SEED_TASK.id);
      expect(saved.createdAt).toBe(SEED_TASK.createdAt);
      expect(saved.titleKey).toBe('kanban.seed.101.title');
      expect(saved.descriptionKey).toBe('kanban.seed.101.description');
    });

    it('should drop the title key when the user edits the title', () => {
      const dialog = setup(SEED_TASK);
      dialog.form.patchValue({ title: 'Eigener Titel' });
      dialog.save();

      const saved = result();
      expect(saved.title).toBe('Eigener Titel');
      // Keeping the key would point at a string the task no longer holds.
      expect(saved.titleKey).toBeNull();
    });

    it('should drop the description key when the user edits the description', () => {
      const dialog = setup(SEED_TASK);
      dialog.form.patchValue({ description: 'Eigene Beschreibung' });
      dialog.save();

      expect(result().descriptionKey).toBeNull();
    });
  });

  describe('new task', () => {
    it('should generate an id and leave the keys null', () => {
      const dialog = setup();
      dialog.form.patchValue({ title: 'Neue Aufgabe' });
      dialog.save();

      const saved = result();
      expect(saved.id).toMatch(/^TSK-\d+$/);
      expect(saved.titleKey).toBeNull();
    });

    /**
     * Regression: the default description used to be produced by
     * `translate.text(...)` and stored on the task, freezing whichever locale
     * happened to be active at creation time into the data.
     */
    it('should not bake the active locale into an empty description', () => {
      const dialog = setup();
      dialog.form.patchValue({ title: 'Neue Aufgabe', description: '' });

      TestBed.inject(TranslateService).setLocale(FR);
      TestBed.tick();
      dialog.save();

      const saved = result();
      expect(saved.description).toBe('');
      expect(saved.descriptionKey).toBe('kanban.dialog.defaultDescription');
    });

    it('should keep the default description localised in both directions', () => {
      const dialog = setup();
      dialog.form.patchValue({ title: 'Neue Aufgabe', description: '' });
      TestBed.inject(TranslateService).setLocale(FR);
      TestBed.tick();
      dialog.save();

      const translate = TestBed.inject(TranslateService);
      const saved = result();

      const inFrench = translate.text(saved.descriptionKey!);
      expect(inFrench).toBe('Aucune description fournie.');

      translate.setLocale('de');
      TestBed.tick();
      expect(translate.text(saved.descriptionKey!)).toBe('Keine Beschreibung angegeben.');
    });

    it('should use a locale-independent default tag', () => {
      const dialog = setup();
      dialog.form.patchValue({ title: 'Neue Aufgabe', tags: '' });

      TestBed.inject(TranslateService).setLocale(FR);
      TestBed.tick();
      dialog.save();

      // Tags are data and are matched by the search box, so the default must
      // not depend on the language active at creation time.
      expect(result().tags).toEqual(['Allgemein']);
    });
  });

  it('should not close while the form is invalid', () => {
    const dialog = setup();
    dialog.form.patchValue({ title: '' });
    dialog.save();
    expect(close).not.toHaveBeenCalled();
  });
});
