import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectDialog, type ProjectItem } from './project-dialog';

const EXISTING: ProjectItem = {
  id: 'PRJ-1024',
  name: 'Refonte E-commerce NextGen',
  client: 'OmniStore Retail',
  category: 'Web App',
  status: 'Actif',
  priority: 'Haute',
  budget: 68000,
  progress: 75,
  dueDate: new Date('2026-11-15'),
};

describe('ProjectDialog', () => {
  function setup(data: ProjectItem | null = null): {
    dialogRef: MatDialogRef<ProjectDialog>;
    close: jest.Mock;
  } {
    const close = jest.fn();

    TestBed.configureTestingModule({
      imports: [ProjectDialog],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    });

    return { dialogRef: TestBed.inject(MatDialogRef) as MatDialogRef<ProjectDialog>, close };
  }

  function fill(component: ProjectDialog, values: Record<string, string | number>): void {
    component.form.patchValue(values);
  }

  describe('create mode', () => {
    it('should start empty and invalid', () => {
      setup();
      const component = TestBed.runInInjectionContext(
        () => new ProjectDialog(),
      ) as unknown as ProjectDialog;

      expect(component.data).toBeNull();
      expect(component.form.invalid).toBe(true);
    });

    it('should require a name of at least 3 characters and a client', () => {
      setup();
      const component = TestBed.runInInjectionContext(
        () => new ProjectDialog(),
      ) as unknown as ProjectDialog;

      fill(component, { name: 'ab', client: '' });
      expect(component.form.get('name')?.hasError('minlength')).toBe(true);
      expect(component.form.get('client')?.hasError('required')).toBe(true);

      fill(component, { name: 'Dashboard Relaunch', client: 'Acme Corp' });
      expect(component.form.valid).toBe(true);
    });

    it('should reject a negative budget and out-of-range progress', () => {
      setup();
      const component = TestBed.runInInjectionContext(
        () => new ProjectDialog(),
      ) as unknown as ProjectDialog;

      fill(component, { name: 'Valid Name', client: 'Acme', budget: -1, progress: 150 });
      expect(component.form.get('budget')?.hasError('min')).toBe(true);
      expect(component.form.get('progress')?.hasError('max')).toBe(true);
    });

    it('should not close the dialog while the form is invalid', () => {
      const { close } = setup();
      const component = TestBed.runInInjectionContext(
        () => new ProjectDialog(),
      ) as unknown as ProjectDialog;

      component.save();
      expect(close).not.toHaveBeenCalled();
    });

    it('should emit a new project with a generated id', () => {
      const { close } = setup();
      const component = TestBed.runInInjectionContext(
        () => new ProjectDialog(),
      ) as unknown as ProjectDialog;

      fill(component, {
        name: 'Dashboard Relaunch',
        client: 'Acme Corp',
        budget: 25000,
        progress: 40,
      });
      component.save();

      expect(close).toHaveBeenCalledTimes(1);
      const result = close.mock.calls[0][0] as ProjectItem;
      expect(result.name).toBe('Dashboard Relaunch');
      expect(result.client).toBe('Acme Corp');
      expect(result.budget).toBe(25000);
      expect(result.progress).toBe(40);
      expect(result.id).toMatch(/^PRJ-\d{4}$/);
      expect(result.dueDate).toBeInstanceOf(Date);
    });

    it('should coerce numeric form controls to numbers', () => {
      const { close } = setup();
      const component = TestBed.runInInjectionContext(
        () => new ProjectDialog(),
      ) as unknown as ProjectDialog;

      // The budget input is a plain HTML number input, so the raw value is a string.
      fill(component, { name: 'String Budget', client: 'Acme', budget: '42000' });
      component.save();

      const result = close.mock.calls[0][0] as ProjectItem;
      expect(typeof result.budget).toBe('number');
      expect(result.budget).toBe(42000);
    });
  });

  describe('edit mode', () => {
    it('should prefill from the injected data', () => {
      setup(EXISTING);
      const component = TestBed.runInInjectionContext(
        () => new ProjectDialog(),
      ) as unknown as ProjectDialog;

      expect(component.data).toEqual(EXISTING);
      expect(component.form.getRawValue()).toMatchObject({
        name: EXISTING.name,
        client: EXISTING.client,
        category: EXISTING.category,
        status: EXISTING.status,
        priority: EXISTING.priority,
        budget: EXISTING.budget,
        progress: EXISTING.progress,
      });
      expect(component.form.valid).toBe(true);
    });

    it('should keep the original id and due date on save', () => {
      const { close } = setup(EXISTING);
      const component = TestBed.runInInjectionContext(
        () => new ProjectDialog(),
      ) as unknown as ProjectDialog;

      fill(component, { name: 'Renamed Project' });
      component.save();

      const result = close.mock.calls[0][0] as ProjectItem;
      expect(result.id).toBe(EXISTING.id);
      expect(result.dueDate).toBe(EXISTING.dueDate);
      expect(result.name).toBe('Renamed Project');
    });
  });

  it('cancel should close without a result', () => {
    const { close } = setup();
    const component = TestBed.runInInjectionContext(
      () => new ProjectDialog(),
    ) as unknown as ProjectDialog;

    component.cancel();
    expect(close).toHaveBeenCalledWith();
  });
});
