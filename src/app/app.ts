import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SideBar } from "./components/side-bar/side-bar";
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProjectWorkAdmin');
  private readonly router = inject(Router);

  // Questo getter controlla se NON siamo nella pagina di login.
  // Viene ricalcolato automaticamente da Angular.
  get isLogged(): boolean {
    return this.router.url !== '/login';
  }
}
