import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService, Patient } from '@core/patient.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-clinician-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './clinician-dashboard.html',
  styleUrl: './clinician-dashboard.scss',
})
export class ClinicianDashboardComponent implements OnInit {
  patients: Patient[] = [];
  loading = false;
  error: string | null = null;

  // simple form model
  newName = '';
  newDateBirth: Date | null = null;

  constructor(private patientService: PatientService) {}

  async ngOnInit() {
    await this.loadPatients();
  }

  async loadPatients() {
    this.loading = true;
    this.error = null;
    try {
      this.patients = await this.patientService.getPatients();
    } catch (e) {
      console.error('ClinicianDashboard: failed to load patients:', e);
      this.error = 'Could not load patients.';
    } finally {
      this.loading = false;
    }
  }

  async addPatient() {
    if (!this.newName) return;
    try {
      await this.patientService.addPatient({
        name: this.newName,
        date_birth: this.newDateBirth,
        sex: null,
        last_assessment: null,
        status: 'New',
      });
      this.newName = '';
      this.newDateBirth = null;
      await this.loadPatients();
    } catch (e) {
      console.error('ClinicianDashboard: failed to add patient:', e);
      this.error = 'Could not add patient.';
    }
  }
}