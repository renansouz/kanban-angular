import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { noAuthGuard } from './no-auth.guard';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'set-password', component: SetPasswordComponent },
    { path: '**', redirectTo: '' , pathMatch: 'full'}
];
