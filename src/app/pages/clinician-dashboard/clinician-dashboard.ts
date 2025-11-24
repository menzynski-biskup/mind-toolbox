import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clinician-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clinician-dashboard.html',
  styleUrl: './clinician-dashboard.scss',
})
export class ClinicianDashboardComponent {}