import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormsDemoPage } from './forms-demo';

describe('FormsDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsDemoPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(FormsDemoPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize with default controls and 2 skills in FormArray', () => {
    const fixture = TestBed.createComponent(FormsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.form.get('username')).toBeTruthy();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('passwordGroup')).toBeTruthy();
    expect(component.skillsArray.length).toBe(2);
    expect(component.form.valid).toBe(false);
  });

  it('should invalidate passwordGroup when password and confirmPassword do not match', () => {
    const fixture = TestBed.createComponent(FormsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const pwdGroup = component.form.controls.passwordGroup;
    pwdGroup.controls.password.setValue('ValidPass123!');
    pwdGroup.controls.confirmPassword.setValue('MismatchPass123!');
    pwdGroup.updateValueAndValidity();

    expect(pwdGroup.hasError('passwordMismatch')).toBe(true);

    pwdGroup.controls.confirmPassword.setValue('ValidPass123!');
    pwdGroup.updateValueAndValidity();

    expect(pwdGroup.hasError('passwordMismatch')).toBe(false);
  });

  it('should compute password score and criteria correctly', () => {
    const fixture = TestBed.createComponent(FormsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.passwordScore()).toBe(0);

    // Full robust password (length >= 8, uppercase, lowercase, digit, special)
    component.form.controls.passwordGroup.controls.password.setValue('Strong@2026!');
    // Trigger raw value signal update
    component.formRawValue.set(component.form.getRawValue());
    fixture.detectChanges();

    expect(component.passwordScore()).toBe(100);
    expect(component.passwordCriteria().hasUpper).toBe(true);
    expect(component.passwordCriteria().hasSpecial).toBe(true);
    expect(component.passwordStrengthLabel()).toContain('Ausgezeichnet');
  });

  it('should add and remove skills from FormArray', () => {
    const fixture = TestBed.createComponent(FormsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.skillsArray.length).toBe(2);

    component.addSkill();
    expect(component.skillsArray.length).toBe(3);

    component.removeSkill(2);
    expect(component.skillsArray.length).toBe(2);
  });

  it('should fill sample data and make the form valid', () => {
    const fixture = TestBed.createComponent(FormsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.fillSampleData();
    fixture.detectChanges();

    expect(component.form.controls.username.value).toBe('dev_alexandre');
    expect(component.form.controls.terms.value).toBe(true);
    expect(component.skillsArray.length).toBe(3);
  });

  it('should reset form to default values', () => {
    const fixture = TestBed.createComponent(FormsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.fillSampleData();
    expect(component.form.controls.username.value).toBe('dev_alexandre');

    component.resetForm();
    fixture.detectChanges();

    expect(component.form.controls.username.value).toBe('');
    expect(component.form.controls.terms.value).toBe(false);
    expect(component.skillsArray.length).toBe(2);
  });
});
