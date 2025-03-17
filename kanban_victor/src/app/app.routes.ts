import { Routes } from '@angular/router';
import { MainViewComponent } from './pages/main-view/main-view.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: MainViewComponent },
  { path: 'tasks', component: MainViewComponent },
  { path: 'home', component: HomeComponent },
];
