import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SideBar } from "./components/side-bar/side-bar";
import { Footer } from './components/footer/footer';
import { AuthService } from './services/auth-service';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';
import { ErrorToast } from './components/error-toast/error-toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBar, Footer, LoadingSpinner, ErrorToast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProjectWorkAdmin');
  private readonly authService = inject(AuthService);

  readonly isLogged = this.authService.isLogged;
}
