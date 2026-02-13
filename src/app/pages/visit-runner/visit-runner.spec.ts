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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires consent attestation before completing consent step', () => {
    const state = component as unknown as {
      currentIndex: { set: (value: number) => void };
      consentAttested: { set: (value: boolean) => void };
      canCompleteStep: () => boolean;
    };

    state.currentIndex.set(1);
    expect(state.canCompleteStep()).toBeFalsy();

    state.consentAttested.set(true);
    expect(state.canCompleteStep()).toBeTruthy();
  });
});
