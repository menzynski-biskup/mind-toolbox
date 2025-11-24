import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  constructor(private router: Router) {}

  goClinician() {
    this.router.navigate(['/clinician']);
  }

  goResearcher() {
    this.router.navigate(['/researcher']);
  }
}