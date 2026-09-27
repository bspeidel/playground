import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { StepperDemoPage } from './stepper-demo';
import { MatStepper } from '@angular/material/stepper';

describe('StepperDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperDemoPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the stepper demo component', () => {
    const fixture = TestBed.createComponent(StepperDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with default service form values', () => {
    const fixture = TestBed.createComponent(StepperDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.serviceForm.get('name')?.value).toBe('payments-gateway');
    expect(component.serviceForm.get('type')?.value).toBe('api');
    expect(component.serviceForm.get('region')?.value).toBe('europe-west9');
    expect(component.serviceForm.valid).toBe(true);
  });

  it('should validate service name format', () => {
    const fixture = TestBed.createComponent(StepperDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const nameControl = component.serviceForm.get('name');
    nameControl?.setValue('Invalid_Name!');
    expect(nameControl?.hasError('pattern')).toBe(true);

    nameControl?.setValue('ab');
    expect(nameControl?.hasError('minlength')).toBe(true);

    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBe(true);

    nameControl?.setValue('valid-service-123');
    expect(nameControl?.valid).toBe(true);
  });

  it('should toggle orientation and linear mode', () => {
    const fixture = TestBed.createComponent(StepperDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.stepperOrientation()).toBe('horizontal');
    component.setOrientation('vertical');
    expect(component.stepperOrientation()).toBe('vertical');

    expect(component.isLinear()).toBe(true);
    component.toggleLinear(false);
    expect(component.isLinear()).toBe(false);
  });

  it('should compute monthly and hourly cost reactively', () => {
    const fixture = TestBed.createComponent(StepperDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const initialMonthly = component.monthlyCost();
    expect(initialMonthly).toBeGreaterThan(0);
    expect(component.hourlyCost()).toBeGreaterThan(0);
    expect(component.maxMonthlyCost()).toBeGreaterThan(initialMonthly);

    // Increase CPU cores and verify cost updates
    component.cpuCores.set(8);
    fixture.detectChanges();
    expect(component.monthlyCost()).toBeGreaterThan(initialMonthly);
  });

  it('should manage dynamic environment variables and secrets', () => {
    const fixture = TestBed.createComponent(StepperDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const initialCount = component.envVars().length;
    component.addEnvVar();
    fixture.detectChanges();
    expect(component.envVars().length).toBe(initialCount + 1);

    const added = component.envVars()[component.envVars().length - 1];
    component.updateEnvKey(added.id, 'custom_key');
    component.updateEnvValue(added.id, 'custom_val');
    component.toggleSecretVisibility(added.id);
    fixture.detectChanges();

    const updated = component.envVars().find((v) => v.id === added.id);
    expect(updated?.key).toBe('CUSTOM_KEY');
    expect(updated?.value).toBe('custom_val');
    expect(updated?.isSecret).toBe(true);

    component.removeEnvVar(added.id);
    fixture.detectChanges();
    expect(component.envVars().length).toBe(initialCount);
  });

  it('should load environment presets', () => {
    const fixture = TestBed.createComponent(StepperDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.loadPreset('python');
    fixture.detectChanges();
    expect(component.envVars().some((v) => v.key === 'PYTHONUNBUFFERED')).toBe(true);

    component.loadPreset('go');
    fixture.detectChanges();
    expect(component.envVars().some((v) => v.key === 'GIN_MODE')).toBe(true);
  });

  it('should initiate deployment and update status', () => {
    const fixture = TestBed.createComponent(StepperDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.deploymentStatus()).toBe('idle');
    component.startDeployment();
    expect(component.deploymentStatus()).toBe('deploying');
    expect(component.deploymentProgress()).toBeGreaterThanOrEqual(10);
  });

  it('should reset all states and form values', () => {
    const fixture = TestBed.createComponent(StepperDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.cpuCores.set(12);
    component.serviceForm.get('name')?.setValue('altered-name');

    const fakeStepper = { reset: jest.fn() } as unknown as MatStepper;
    component.resetAll(fakeStepper);
    fixture.detectChanges();

    expect(component.cpuCores()).toBe(2);
    expect(component.serviceForm.get('name')?.value).toBe('payments-gateway');
    expect(fakeStepper.reset).toHaveBeenCalled();
  });
});
