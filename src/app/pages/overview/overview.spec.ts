import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OverviewPage } from './overview';

describe('OverviewPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the overview page', () => {
    const fixture = TestBed.createComponent(OverviewPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display feature cards', () => {
    const fixture = TestBed.createComponent(OverviewPage);
    const component = fixture.componentInstance;
    expect(component.features.length).toBe(9);
  });
});
