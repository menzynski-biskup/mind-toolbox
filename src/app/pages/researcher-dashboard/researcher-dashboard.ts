import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-researcher-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './researcher-dashboard.html',
  styleUrl: './researcher-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearcherDashboardComponent {
  protected readonly workspaceProgram = 'Memory & Aging Initiative';
  protected readonly summaryCards = [
    {
      title: 'Workspace overview',
      description: '4 projects coordinating 9 active studies with reusable visit templates.',
      meta: 'Last updated 2 hours ago',
    },
    {
      title: 'Participant pipeline',
      description: '84 participants enrolled with intake eligibility checks running automatically.',
      meta: '12 pending intake reviews',
    },
    {
      title: 'Upcoming sessions',
      description: '18 visits scheduled across Intake, Session 1, and Session 2 templates.',
      meta: 'Next session in 3 days',
    },
  ];

  protected readonly routeMap = [
    { path: '/app/dashboard', purpose: 'Researcher overview + planning artifacts', status: 'Scaffolded' },
    { path: '/app/projects', purpose: 'Project portfolio and funding oversight', status: 'Scaffolded' },
    { path: '/app/projects/:projectId', purpose: 'Project-specific timeline and reports', status: 'Planned' },
    { path: '/app/studies', purpose: 'Study protocol management', status: 'Scaffolded' },
    { path: '/app/studies/:studyId/protocol', purpose: 'Structured protocol details', status: 'Planned' },
    { path: '/app/studies/:studyId/templates', purpose: 'Visit templates + scripts', status: 'Planned' },
    { path: '/app/participants', purpose: 'Participant registry and eligibility', status: 'Scaffolded' },
    { path: '/app/visits', purpose: 'Scheduling and visit coordination', status: 'Scaffolded' },
    { path: '/app/visits/runner', purpose: 'Sequential visit runner experience', status: 'Scaffolded' },
    { path: '/app/toolbox', purpose: 'Tasks and questionnaire library', status: 'Scaffolded' },
    { path: '/app/teams', purpose: 'Roles, assignments, and training', status: 'Scaffolded' },
    { path: '/app/documents', purpose: 'Protocols, consents, and assets', status: 'Scaffolded' },
    { path: '/app/exports', purpose: 'Data exports and audit logs', status: 'Scaffolded' },
    { path: '/app/help', purpose: 'Support and onboarding', status: 'Scaffolded' },
  ];

  protected readonly stateModel = [
    { name: 'session', detail: 'Authenticated user, role, workspace context, and permissions.' },
    { name: 'projects', detail: 'Portfolio list, status filters, and selected project context.' },
    { name: 'studies', detail: 'Study metadata, protocol sections, and visit template coverage.' },
    { name: 'visitTemplates', detail: 'Template definitions with ordered script steps and requirements.' },
    { name: 'participants', detail: 'Roster, intake responses, eligibility flags, and cohort status.' },
    { name: 'scheduledVisits', detail: 'Scheduled visit instances with coordinator assignments.' },
    { name: 'visitRunner', detail: 'Current step, responses, validations, and completion log.' },
    { name: 'results', detail: 'Questionnaire scores, task outputs, and export readiness status.' },
    { name: 'ui', detail: 'Filters, navigation state, and draft edits.' },
  ];

  protected readonly apiPlan = [
    { method: 'GET', path: '/api/workspaces', purpose: 'List accessible workspaces.' },
    { method: 'POST', path: '/api/projects', purpose: 'Create new research project.' },
    { method: 'GET', path: '/api/projects/:id', purpose: 'Fetch project summary and timeline.' },
    { method: 'POST', path: '/api/studies', purpose: 'Create study protocol within a project.' },
    { method: 'GET', path: '/api/studies/:id/templates', purpose: 'Load visit templates and script steps.' },
    { method: 'POST', path: '/api/participants', purpose: 'Enroll participant and capture intake.' },
    { method: 'POST', path: '/api/visits/schedule', purpose: 'Schedule a visit instance.' },
    { method: 'POST', path: '/api/visits/:id/steps', purpose: 'Log visit step completion.' },
    { method: 'POST', path: '/api/results/eligibility', purpose: 'Auto-check eligibility rules.' },
    { method: 'POST', path: '/api/exports', purpose: 'Generate export package.' },
  ];

  protected readonly d1Tables = [
    { table: 'workspaces', fields: 'id, name, owner_id', relation: '1:N projects' },
    { table: 'projects', fields: 'id, workspace_id, name, sponsor', relation: '1:N studies' },
    { table: 'studies', fields: 'id, project_id, title, protocol_status', relation: '1:N templates' },
    { table: 'study_protocol_sections', fields: 'study_id, section, content', relation: '1:1 per protocol section' },
    { table: 'visit_templates', fields: 'id, study_id, name, order', relation: '1:N script steps' },
    { table: 'script_steps', fields: 'id, template_id, type, required', relation: 'ordered per template' },
    { table: 'participants', fields: 'id, study_id, status, demographics', relation: '1:N scheduled visits' },
    { table: 'scheduled_visits', fields: 'id, participant_id, template_id, status', relation: '1:N results' },
    { table: 'visit_results', fields: 'visit_id, step_id, payload', relation: 'captures responses + scores' },
    { table: 'documents', fields: 'id, study_id, type, url', relation: 'protocol + consent files' },
  ];

  protected readonly phases = [
    {
      phase: 'MVP',
      focus: 'Core study setup + visit execution',
      items: [
        'Project + study creation with structured protocol fields.',
        'Visit templates with script steps (instruction, consent, questionnaire, task, completion).',
        'Participant intake, eligibility auto-check, and visit scheduling.',
        'Visit runner with sequential validation and completion logging.',
      ],
    },
    {
      phase: 'v1.1',
      focus: 'Operational maturity',
      items: [
        'Role-based access controls and team assignments.',
        'Document management for consent and protocol artifacts.',
        'Scheduling automation for follow-up sessions.',
        'Export-ready audit trail for visits and results.',
      ],
    },
    {
      phase: 'v1.2',
      focus: 'Analytics + integrations',
      items: [
        'Dashboards for cohort metrics and data quality.',
        'Task integrations beyond AVLT and scoring pipelines.',
        'Automated export deliveries and analytics hooks.',
      ],
    },
  ];

  protected readonly wireframes = [
    { page: 'Dashboard', detail: 'Overview cards, IA map, plans, and cross-link to critical workflows.' },
    { page: 'Projects', detail: 'Portfolio table with funding, timelines, and linked studies.' },
    { page: 'Studies', detail: 'Protocol editor, visit templates, and script builder panels.' },
    { page: 'Participants', detail: 'Roster, eligibility badges, and intake summary drawer.' },
    { page: 'Visits', detail: 'Calendar view, visit status, and launch runner CTA.' },
    { page: 'Visit Runner', detail: 'Sequential steps, validation, progress, and completion log.' },
    { page: 'Toolbox', detail: 'Task/questionnaire library with scoring rules.' },
    { page: 'Teams', detail: 'Roles, assignments, and training status.' },
    { page: 'Documents', detail: 'Protocol + consent repository with versioning.' },
    { page: 'Exports', detail: 'Export queue, audit log, and dataset health.' },
    { page: 'Help', detail: 'Onboarding checklists and support intake.' },
  ];
}
