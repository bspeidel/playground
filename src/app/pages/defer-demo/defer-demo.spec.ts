import { TestBed } from '@angular/core/testing';
import { DeferDemoPage } from './defer-demo';

describe('DeferDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeferDemoPage],
    }).compileComponents();
  });

  it('should create the defer demo page', () => {
    const fixture = TestBed.createComponent(DeferDemoPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
