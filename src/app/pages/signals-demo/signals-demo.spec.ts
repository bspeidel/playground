import { TestBed } from '@angular/core/testing';
import { SignalsDemoPage } from './signals-demo';

describe('SignalsDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsDemoPage],
    }).compileComponents();
  });

  it('should create the signals demo page', () => {
    const fixture = TestBed.createComponent(SignalsDemoPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should reactively update counter and computed double', () => {
    const fixture = TestBed.createComponent(SignalsDemoPage);
    const component = fixture.componentInstance;

    expect(component.count()).toBe(0);
    expect(component.doubleCount()).toBe(0);
    expect(component.isHighCount()).toBe(false);

    component.increment();
    expect(component.count()).toBe(1);
    expect(component.doubleCount()).toBe(2);

    for (let i = 0; i < 9; i++) {
      component.increment();
    }
    expect(component.count()).toBe(10);
    expect(component.doubleCount()).toBe(20);
    expect(component.isHighCount()).toBe(true);

    component.reset();
    expect(component.count()).toBe(0);
    expect(component.doubleCount()).toBe(0);
  });

  it('should reset planQuantity with linkedSignal when selectedPlan changes', () => {
    const fixture = TestBed.createComponent(SignalsDemoPage);
    const component = fixture.componentInstance;

    expect(component.selectedPlan().id).toBe('starter');
    expect(component.planQuantity()).toBe(1);

    component.updatePlanQuantity(3);
    expect(component.planQuantity()).toBe(4);

    const proPlan = component.plans.find((p) => p.id === 'pro')!;
    component.selectPlan(proPlan);
    expect(component.selectedPlan().id).toBe('pro');
    expect(component.planQuantity()).toBe(5);
  });

  it('should compute cart totals and update quantity', () => {
    const fixture = TestBed.createComponent(SignalsDemoPage);
    const component = fixture.componentInstance;

    const initialTotal = component.totalPrice();
    expect(initialTotal).toBeGreaterThan(0);

    const firstItem = component.items()[0];
    component.updateQuantity(firstItem.id, 1);
    expect(component.totalPrice()).toBe(initialTotal + firstItem.price);

    component.removeItem(firstItem.id);
    expect(component.items().find((i) => i.id === firstItem.id)).toBeUndefined();
  });
});
