import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type StepType = 'instruction' | 'consent' | 'questionnaire' | 'task' | 'completion';

interface VisitStep {
  id: string;
  title: string;
  description: string;
  type: StepType;
  required: boolean;
}

interface CompletionLogEntry {
  id: string;
  title: string;
  timestamp: string;
  note: string;
}

const MIN_AGE = 18;
const MAX_AGE_BOUNDARY = 120;
const MIN_PHQ9_SCORE = 0;
const MAX_PHQ9_SCORE = 27;
const ELIGIBLE_MAX_PHQ9_SCORE = 10;

@Component({
  selector: 'app-visit-runner',
  imports: [CommonModule],
  templateUrl: './visit-runner.html',
  styleUrl: './visit-runner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitRunnerComponent {
  protected readonly MIN_AGE = MIN_AGE;
  protected readonly MAX_AGE_BOUNDARY = MAX_AGE_BOUNDARY;
  protected readonly MIN_PHQ9_SCORE = MIN_PHQ9_SCORE;
  protected readonly MAX_PHQ9_SCORE = MAX_PHQ9_SCORE;

  protected readonly steps: VisitStep[] = [
    {
      id: 'instruction',
      title: 'Orientation',
      description: 'Introduce the visit flow, confirm materials, and outline expectations.',
      type: 'instruction',
      required: true,
    },
    {
      id: 'consent',
      title: 'Consent attestation',
      description: 'Capture participant consent via attestation or signature placeholder.',
      type: 'consent',
      required: true,
    },
    {
      id: 'questionnaire',
      title: 'Intake questionnaire',
      description: 'Collect demographics and baseline questionnaire scores.',
      type: 'questionnaire',
      required: true,
    },
    {
      id: 'task',
      title: 'AVLT task',
      description: 'Launch the AVLT task placeholder and capture completion status.',
      type: 'task',
      required: true,
    },
    {
      id: 'completion',
      title: 'Wrap-up',
      description: 'Review completion summary and prepare follow-up scheduling.',
      type: 'completion',
      required: false,
    },
  ];

  protected readonly currentIndex = signal(0);
  protected readonly completedSteps = signal<Set<string>>(new Set());
  protected readonly completionLog = signal<CompletionLogEntry[]>([]);

  protected readonly consentAttested = signal(false);
  protected readonly intakeAge = signal<number | null>(null);
  protected readonly phq9Score = signal<number | null>(null);
  protected readonly taskCompleted = signal(false);

  protected readonly currentStep = computed(() => this.steps[this.currentIndex()]);
  protected readonly progressPercent = computed(() =>
    Math.round((this.completedSteps().size / this.steps.length) * 100)
  );

  protected readonly eligibility = computed(() => {
    const age = this.intakeAge();
    const score = this.phq9Score();
    if (age === null || score === null) {
      return { status: 'Pending', detail: 'Enter age and PHQ-9 score to auto-check eligibility.' };
    }
    const eligible = age >= MIN_AGE && score <= ELIGIBLE_MAX_PHQ9_SCORE;
    return {
      status: eligible ? 'Eligible' : 'Review required',
      detail: eligible
        ? 'Participant meets baseline eligibility thresholds.'
        : 'Scores exceed baseline threshold; flag for coordinator review.',
    };
  });

  protected readonly canCompleteStep = computed(() => {
    const step = this.currentStep();
    if (!step || this.isStepComplete(step.id)) {
      return false;
    }
    if (!step.required) {
      return true;
    }
    switch (step.type) {
      case 'consent':
        return this.consentAttested();
      case 'questionnaire':
        return this.isQuestionnaireValid();
      case 'task':
        return this.taskCompleted();
      default:
        return true;
    }
  });

  protected readonly canAdvance = computed(() => {
    const step = this.currentStep();
    if (!step) {
      return false;
    }
    return this.isStepComplete(step.id) && this.currentIndex() < this.steps.length - 1;
  });

  protected readonly canGoBack = computed(() => this.currentIndex() > 0);

  protected isStepComplete(stepId: string): boolean {
    return this.completedSteps().has(stepId);
  }

  protected completeCurrentStep(): void {
    const step = this.currentStep();
    if (!step || !this.canCompleteStep()) {
      return;
    }
    this.completedSteps.update((current) => {
      const updated = new Set(current);
      updated.add(step.id);
      return updated;
    });
    this.completionLog.update((entries) => [
      ...entries,
      {
        id: step.id,
        title: step.title,
        timestamp: new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(
          new Date()
        ),
        note: step.required ? 'Required step completed.' : 'Optional step completed.',
      },
    ]);
  }

  protected goNext(): void {
    if (!this.canAdvance()) {
      return;
    }
    this.currentIndex.update((index) => Math.min(index + 1, this.steps.length - 1));
  }

  protected goPrevious(): void {
    if (!this.canGoBack()) {
      return;
    }
    this.currentIndex.update((index) => Math.max(index - 1, 0));
  }

  protected updateConsent(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.consentAttested.set(target.checked);
  }

  protected updateIntakeAge(event: Event): void {
    this.intakeAge.set(this.parseNumber(event));
  }

  protected updatePhq9Score(event: Event): void {
    this.phq9Score.set(this.parseNumber(event));
  }

  protected toggleTaskCompletion(): void {
    this.taskCompleted.update((current) => !current);
  }

  private isQuestionnaireValid(): boolean {
    const age = this.intakeAge();
    const score = this.phq9Score();
    if (age === null || score === null) {
      return false;
    }
    return (
      age >= MIN_AGE &&
      age <= MAX_AGE_BOUNDARY &&
      score >= MIN_PHQ9_SCORE &&
      score <= MAX_PHQ9_SCORE
    );
  }

  private parseNumber(event: Event): number | null {
    const value = (event.target as HTMLInputElement).value;
    if (!value) {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
