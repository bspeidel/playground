import { TestBed } from '@angular/core/testing';
import { MaterialDemoPage } from './material-demo';

describe('MaterialDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialDemoPage],
    }).compileComponents();
  });

  it('should create the material demo page', () => {
    const fixture = TestBed.createComponent(MaterialDemoPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should increment badge count when requested', () => {
    const fixture = TestBed.createComponent(MaterialDemoPage);
    const component = fixture.componentInstance;

    expect(component.badgeCount()).toBe(5);
    component.incrementBadge();
    expect(component.badgeCount()).toBe(6);
  });
});
