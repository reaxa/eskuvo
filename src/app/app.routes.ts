import { Routes } from '@angular/router';
import { RegistComponent } from './pages/regist/regist.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { BasketComponent } from './pages/basket/basket.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { authGuard, publicGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'aboutus', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  { path: 'regist', component: RegistComponent, canActivate: [publicGuard] },

  { path: 'aboutus', component: AboutusComponent },
  { path: 'categories', component: CategoriesComponent },

  { path: 'basket', component: BasketComponent, canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },

  { path: '**', component: AboutusComponent }
];
