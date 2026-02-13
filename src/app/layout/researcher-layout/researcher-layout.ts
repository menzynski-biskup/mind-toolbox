import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-researcher-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './researcher-layout.html',
  styleUrl: './researcher-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearcherLayoutComponent {
  protected readonly navItems = [
    { label: 'Dashboard', path: '/app/dashboard' },
    { label: 'Projects', path: '/app/projects' },
    { label: 'Studies', path: '/app/studies' },
    { label: 'Participants', path: '/app/participants' },
    { label: 'Visits', path: '/app/visits' },
    { label: 'Toolbox', path: '/app/toolbox' },
    { label: 'Teams', path: '/app/teams' },
    { label: 'Documents', path: '/app/documents' },
    { label: 'Exports', path: '/app/exports' },
    { label: 'Help', path: '/app/help' },
  ];

  protected readonly workspace = {
    name: 'Neurocognitive Research Lab',
    program: 'Memory & Aging Initiative',
    activeProjects: 4,
    activeStudies: 9,
  };

  protected readonly user = {
    name: 'Dr. Jamie Rivera',
    role: 'Lead Researcher',
  };

  protected readonly quickActions = [
    { label: 'New Project', detail: 'Launch protocol builder' },
    { label: 'Schedule Visit', detail: 'Queue intake session' },
    { label: 'Export Snapshot', detail: 'Download data package' },
  ];
}
