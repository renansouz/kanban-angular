import { Routes } from '@angular/router';

import { TaskComponent } from './components/task/task.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

import { InvoicesComponent } from './pages/invoices/invoices.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'task',
  },
  {
    path: 'task',
    component: TaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices',
    component: InvoicesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product',
    component: AddProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    component: AboutUsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
];
