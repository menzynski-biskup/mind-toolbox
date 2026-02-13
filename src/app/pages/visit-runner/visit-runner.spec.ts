import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitRunnerComponent } from './visit-runner';

describe('VisitRunner', () => {
  let component: VisitRunnerComponent;
  let fixture: ComponentFixture<VisitRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitRunnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitRunnerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires consent attestation before completing consent step', () => {
    const getButton = (label: string): HTMLButtonElement => {
      const buttons = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ) as HTMLButtonElement[];
      return buttons.find((button) => button.textContent?.includes(label)) as HTMLButtonElement;
    };

    const completeButton = getButton('Complete step');
    const nextButton = getButton('Next step');

    completeButton.click();
    fixture.detectChanges();
    nextButton.click();
    fixture.detectChanges();

    const consentCompleteButton = getButton('Complete step');
    expect(consentCompleteButton.disabled).toBeTruthy();

    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();

    expect(consentCompleteButton.disabled).toBeFalsy();
  });

  it('logs completion when a step is completed', () => {
    const completeButton = (
      Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[]
    ).find((button) => button.textContent?.includes('Complete step')) as HTMLButtonElement;

    completeButton.click();
    fixture.detectChanges();

    const logEntries = fixture.nativeElement.querySelectorAll('.visit-runner__log li');
    const progressText = fixture.nativeElement.querySelector('.visit-runner__rail .meta-text')?.textContent;

    expect(logEntries.length).toBe(1);
    expect(progressText).toContain('20');
  });
});
