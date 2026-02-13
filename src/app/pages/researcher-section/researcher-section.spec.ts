import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { ResearcherSectionComponent } from './researcher-section';

describe('ResearcherSection', () => {
  let component: ResearcherSectionComponent;
  let fixture: ComponentFixture<ResearcherSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearcherSectionComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { sectionId: 'projects' },
            },
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearcherSectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
