import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeViewModel } from './home.viewmodel';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HomeViewModel],
})
export class HomePageComponent {
  protected readonly vm = inject(HomeViewModel);
}
