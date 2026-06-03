import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { UsersPage } from './components/users-page/users-page';
import { Reservations } from './components/reservations/reservations';
import { AdminProfile } from './components/admin-profile/admin-profile';
import { AuthGuard } from './security/auth-guard';
import { Login } from './components/login/login';
import { ViewReservation } from './components/view-reservation/view-reservation';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'users', component: UsersPage, canActivate: [AuthGuard] },
            { path: 'reservations', component: Reservations, canActivate: [AuthGuard] },
            { path: 'profile', component: AdminProfile, canActivate: [AuthGuard] },
            { path: 'reservations/:id', component: ViewReservation, canActivate: [AuthGuard] },
        ]
    }
];
