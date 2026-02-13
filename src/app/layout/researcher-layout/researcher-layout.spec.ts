import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ResearcherLayoutComponent } from './researcher-layout';

describe('ResearcherLayout', () => {
  let component: ResearcherLayoutComponent;
  let fixture: ComponentFixture<ResearcherLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearcherLayoutComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearcherLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes navigation items and quick actions', () => {
    fixture.detectChanges();
    const navLinks = fixture.nativeElement.querySelectorAll('.researcher-sidebar__nav a');
    const quickActions = fixture.nativeElement.querySelectorAll('.researcher-main__action');

    expect(navLinks.length).toBe(10);
    expect(quickActions.length).toBe(3);
  });
});
