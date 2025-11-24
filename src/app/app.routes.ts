import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { ClinicianDashboardComponent } from './pages/clinician-dashboard/clinician-dashboard';
import { ResearcherDashboardComponent } from './pages/researcher-dashboard/researcher-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'clinician', component: ClinicianDashboardComponent },
  { path: 'researcher', component: ResearcherDashboardComponent },
  { path: '**', redirectTo: 'login' },
];