import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoriesComponent } from './pages/categories/categories.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { BasketComponent } from './pages/basket/basket.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistComponent } from './pages/regist/regist.component';
import { MenuComponent } from './shared/menu/menu.component';
import { NgIf } from '@angular/common';
import { CardsComponent } from './cards/cards.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CategoriesComponent, AboutusComponent, BasketComponent, ProfileComponent, LoginComponent,HeaderComponent ,RegistComponent, MenuComponent, NgIf, CardsComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eskuvo';



}
