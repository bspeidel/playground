import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { MatSidenav } from '@angular/material/sidenav';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render brand title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('Playground');
  });

  it('should have 3 navigation categories configured', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.navCategories.length).toBe(3);
    expect(app.navCategories[0].name).toBe('Général');
    expect(app.navCategories[1].name).toBe('Fonctionnalités Angular & Perf');
    expect(app.navCategories[2].name).toBe('Composants & Démos UI');
  });

  it('should have navigation links configured with 12 items', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.navLinks.length).toBe(12);
  });

  it('should have theme service available', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.themeService).toBeTruthy();
  });

  it('should render menu toggle button and sidenav container', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.menu-toggle-btn')).toBeTruthy();
    expect(compiled.querySelector('.main-sidenav')).toBeTruthy();
  });

  it('should close sidenav on navigation link click when mobile', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const mockSidenav = {
      close: jest.fn().mockResolvedValue('close'),
    } as unknown as MatSidenav;

    app.isMobile.set(false);
    app.onNavLinkClick(mockSidenav);
    expect(mockSidenav.close).not.toHaveBeenCalled();

    app.isMobile.set(true);
    app.onNavLinkClick(mockSidenav);
    expect(mockSidenav.close).toHaveBeenCalledTimes(1);
  });
});
