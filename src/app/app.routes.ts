import { Routes } from '@angular/router';
import { RegistComponent } from './pages/regist/regist.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { BasketComponent } from './pages/basket/basket.component';
import { CategoriesComponent } from './pages/categories/categories.component';

export const routes: Routes = [
  { path: '', redirectTo: 'aboutus', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'regist', component: RegistComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: '**', component: AboutusComponent }
];
