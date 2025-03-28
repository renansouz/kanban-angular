import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { noAuthGuard } from './no-auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { ProductsComponent } from './components/products/products.component';


export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
    { path: 'set-password', component: SetPasswordComponent },
    { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'invoices', component: InvoicesComponent },
    { path: 'products', component: ProductsComponent },
    { path: '**', redirectTo: '' , pathMatch: 'full'}
];
