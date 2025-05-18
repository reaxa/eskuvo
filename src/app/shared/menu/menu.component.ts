import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgIf, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, AfterViewInit { 
  isLoggedIn$!: Observable<boolean>;

  constructor(public authService: AuthService, private router: Router) {}
  
  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    
 
    console.log("MenuComponent initialized - auth state:", this.authService.isLoggedIn());
    this.isLoggedIn$.subscribe(isLoggedIn => {
      console.log("Auth state changed in MenuComponent:", isLoggedIn);
    });
  }
  
  menuOpened = false;

  toggleMenu() {
    this.menuOpened = !this.menuOpened;
  }

  ngAfterViewInit(): void { 
    console.log("ngAfterViewInit called in MenuComponent"); 
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}