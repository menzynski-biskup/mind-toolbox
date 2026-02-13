import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { ResearcherSectionComponent } from './researcher-section';

describe('ResearcherSection', () => {
  const createComponent = async (sectionId?: string): Promise<ComponentFixture<ResearcherSectionComponent>> => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ResearcherSectionComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { sectionId },
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ResearcherSectionComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  };

  it('should create', async () => {
    const fixture = await createComponent('projects');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders content for a known section id', async () => {
    const fixture = await createComponent('visits');
    const title = fixture.nativeElement.querySelector('#section-title');
    expect(title?.textContent).toContain('Visit');
  });

  it('falls back to projects when section id is unknown', async () => {
    const fixture = await createComponent('unknown');
    const title = fixture.nativeElement.querySelector('#section-title');
    expect(title?.textContent).toContain('Projects');
  });
});
