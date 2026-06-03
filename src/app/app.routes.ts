import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { UsersPage } from './components/users-page/users-page';
import { Reservations } from './components/reservations/reservations';
import { AdminProfile } from './components/admin-profile/admin-profile';
import { AuthGuard } from './security/auth-guard';
import { Login } from './components/login/login';
import { CreateReservation } from './components/create-reservation/create-reservation';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    { path: 'login', component: Login },

    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'users', component: UsersPage },
            { path: 'reservations', component: Reservations},
            { path: 'reservations/new', component: CreateReservation },
            { path: 'profile', component: AdminProfile }
        ]
    },

    { path: '**', redirectTo: 'login' }
];