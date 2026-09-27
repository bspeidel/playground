import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ChartsDemoPage } from './charts-demo';

describe('ChartsDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsDemoPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ChartsDemoPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should compute donut segments with valid percentages and strokeDasharray', () => {
    const fixture = TestBed.createComponent(ChartsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const segments = component.donutSegmentsWithAngles();
    expect(segments.length).toBe(component.donutData().length);

    const totalPercentage = segments.reduce((acc, s) => acc + s.percentage, 0);
    expect(Math.round(totalPercentage)).toBe(100);

    expect(segments[0].strokeDasharray).toBeTruthy();
    expect(component.donutTotal()).toBeGreaterThan(0);
  });

  it('should set and clear active donut hover', () => {
    const fixture = TestBed.createComponent(ChartsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.activeDonutSegment()).toBeNull();

    component.setDonutHover(0);
    fixture.detectChanges();
    expect(component.activeDonutSegment()?.label).toBe(component.donutData()[0].label);

    component.setDonutHover(null);
    fixture.detectChanges();
    expect(component.activeDonutSegment()).toBeNull();
  });

  it('should compute velocity metrics (maxSprintValue, avgCompletedStoryPoints)', () => {
    const fixture = TestBed.createComponent(ChartsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.maxSprintValue()).toBeGreaterThanOrEqual(60);
    expect(component.avgCompletedStoryPoints()).toBeGreaterThan(0);
  });

  it('should compute sparkline spline paths and update when metric changes', () => {
    const fixture = TestBed.createComponent(ChartsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const spark = component.sparklinePoints();
    expect(spark.path.startsWith('M ')).toBe(true);
    expect(spark.points.length).toBeGreaterThan(0);
    expect(component.currentMetric().id).toBe('traffic');

    component.selectedMetricId.set('latency');
    fixture.detectChanges();

    expect(component.currentMetric().id).toBe('latency');
    expect(component.sparklinePoints().points.length).toBe(component.currentMetric().values.length);
  });

  it('should randomize dataset on demand', () => {
    const fixture = TestBed.createComponent(ChartsDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.velocityData()[0].planned).toBeGreaterThan(0);
    component.randomizeData();
    fixture.detectChanges();

    expect(component.velocityData().length).toBeGreaterThan(0);
  });
});
