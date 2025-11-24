import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-researcher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './researcher-dashboard.html',
  styleUrl: './researcher-dashboard.scss',
})
export class ResearcherDashboardComponent {}