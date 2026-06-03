import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SideBar } from "./components/side-bar/side-bar";
import { Footer } from './components/footer/footer';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProjectWorkAdmin');
  private readonly authService = inject(AuthService);

  readonly isLogged = this.authService.isLogged;
}
