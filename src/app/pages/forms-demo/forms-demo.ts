import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateHtmlPipe, TranslatePipe, TranslateService } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';

export interface SkillFormGroup {
  name: FormControl<string>;
  level: FormControl<string>;
  years: FormControl<number>;
}

export interface UserRegistrationForm {
  username: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<string>;
  passwordGroup: FormGroup<{
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;
  skills: FormArray<FormGroup<SkillFormGroup>>;
  newsletter: FormControl<boolean>;
  terms: FormControl<boolean>;
}

export interface SubmittedProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  skillsCount: number;
  submittedAt: Date;
}

// Cross-field validator for password confirmation
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!password || !confirmPassword) return null;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

// Simulated Async Validator: checks username availability against reserved list
function usernameAvailabilityValidator(): AsyncValidatorFn {
  const RESERVED_USERNAMES = ['admin', 'root', 'angular', 'google', 'playground', 'superadmin'];

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }

    // 400ms debounce simulation
    return timer(400).pipe(
      switchMap(() => {
        const val = control.value.trim().toLowerCase();
        if (RESERVED_USERNAMES.includes(val)) {
          return of({ usernameTaken: true });
        }
        return of(null);
      }),
      map((res) => res),
    );
  };
}

@Component({
  selector: 'app-forms-demo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDividerModule,
    TranslatePipe,
    TranslateHtmlPipe,
  ],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsDemoPage {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  // Form State Tracking Signals
  readonly isSubmitting = signal(false);
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly submittedProfiles = signal<SubmittedProfile[]>([]);
  readonly formRawValue = signal<Record<string, unknown>>({});

  // Typed Reactive Form Definition
  readonly form: FormGroup<UserRegistrationForm> = this.fb.group({
    username: this.fb.control('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_-]+$/),
      ],
      asyncValidators: [usernameAvailabilityValidator()],
      updateOn: 'change',
    }),
    email: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    role: this.fb.control('Tech Lead', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    passwordGroup: this.fb.group(
      {
        password: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(8)],
        }),
        confirmPassword: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      { validators: [passwordMatchValidator] },
    ),
    skills: this.fb.array<FormGroup<SkillFormGroup>>([
      this.createSkillGroup('TypeScript', 'Expert', 5),
      this.createSkillGroup('Angular 22', 'Avancé', 4),
    ]),
    newsletter: this.fb.control(true, { nonNullable: true }),
    terms: this.fb.control(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  // Password criteria computed signals
  readonly passwordValue = computed(() => {
    // Read from raw value signal for reactive recalculation
    const group = this.formRawValue()['passwordGroup'] as { password?: string } | undefined;
    return group?.password ?? '';
  });

  readonly passwordCriteria = computed(() => {
    const pwd = this.passwordValue();
    return {
      minLength: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasDigit: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  });

  readonly passwordScore = computed(() => {
    const c = this.passwordCriteria();
    let score = 0;
    if (c.minLength) score += 20;
    if (c.hasUpper) score += 20;
    if (c.hasLower) score += 20;
    if (c.hasDigit) score += 20;
    if (c.hasSpecial) score += 20;
    return score;
  });

  /**
   * Translation key for the current strength bucket. The template renders it
   * through `| t` so the label follows a language switch without recomputing.
   */
  readonly passwordStrengthKey = computed<TranslationKey>(() => {
    const s = this.passwordScore();
    if (s === 0) return 'forms.strength.empty';
    if (s <= 40) return 'forms.strength.weak';
    if (s <= 60) return 'forms.strength.medium';
    if (s <= 80) return 'forms.strength.strong';
    return 'forms.strength.excellent';
  });

  readonly passwordStrengthClass = computed(() => {
    const s = this.passwordScore();
    if (s <= 40) return 'strength-weak';
    if (s <= 60) return 'strength-medium';
    if (s <= 80) return 'strength-strong';
    return 'strength-secure';
  });

  get skillsArray(): FormArray<FormGroup<SkillFormGroup>> {
    return this.form.controls.skills;
  }

  constructor() {
    // Subscribe to form valueChanges to keep the preview signal updated
    this.formRawValue.set(this.form.getRawValue());
    this.form.valueChanges.subscribe(() => {
      this.formRawValue.set(this.form.getRawValue());
    });
  }

  createSkillGroup(name = '', level = 'Intermédiaire', years = 2): FormGroup<SkillFormGroup> {
    return this.fb.group({
      name: this.fb.control(name, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      level: this.fb.control(level, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      years: this.fb.control(years, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1), Validators.max(30)],
      }),
    });
  }

  addSkill(): void {
    this.skillsArray.push(this.createSkillGroup());
    this.snackBar.open(
      this.translate.text('forms.snack.skillAdded'),
      this.translate.text('forms.action.ok'),
      { duration: 1500 },
    );
  }

  removeSkill(index: number): void {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
      this.snackBar.open(
        this.translate.text('forms.snack.skillRemoved'),
        this.translate.text('forms.action.close'),
        { duration: 1500 },
      );
    }
  }

  fillSampleData(): void {
    this.form.patchValue({
      username: 'dev_alexandre',
      email: 'alexandre.roy@example.com',
      role: 'Architecte Cloud',
      passwordGroup: {
        password: 'SuperSecret2026!',
        confirmPassword: 'SuperSecret2026!',
      },
      newsletter: true,
      terms: true,
    });

    // Reset and populate skills
    this.skillsArray.clear();
    this.skillsArray.push(this.createSkillGroup('Angular 22', 'Expert', 6));
    this.skillsArray.push(this.createSkillGroup('Kubernetes & Cloud', 'Avancé', 4));
    this.skillsArray.push(this.createSkillGroup('TypeScript Stricte', 'Expert', 5));

    this.snackBar.open(
      this.translate.text('forms.snack.sampleFilled'),
      this.translate.text('forms.action.super'),
      { duration: 2500 },
    );
  }

  resetForm(): void {
    this.form.reset({
      username: '',
      email: '',
      role: 'Tech Lead',
      newsletter: true,
      terms: false,
    });
    this.skillsArray.clear();
    this.skillsArray.push(this.createSkillGroup('TypeScript', 'Expert', 5));
    this.skillsArray.push(this.createSkillGroup('Angular 22', 'Avancé', 4));
    this.snackBar.open(
      this.translate.text('forms.snack.reset'),
      this.translate.text('forms.action.ok'),
      {
        duration: 2000,
      },
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open(
        this.translate.text('forms.snack.invalid'),
        this.translate.text('forms.action.close'),
        { duration: 3500 },
      );
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);
      const val = this.form.getRawValue();

      const profile: SubmittedProfile = {
        id: `PRF-${Math.floor(1000 + Math.random() * 9000)}`,
        username: val.username,
        email: val.email,
        role: val.role,
        skillsCount: val.skills.length,
        submittedAt: new Date(),
      };

      this.submittedProfiles.update((list) => [profile, ...list]);
      this.snackBar.open(
        this.translate.text('forms.snack.profileSaved', { username: val.username }),
        this.translate.text('forms.action.super'),
        { duration: 4000 },
      );
    }, 600);
  }
}
