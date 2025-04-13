import { BehaviorSubject } from 'rxjs';
import { Rendeles } from '../models/rendeles.model';
import { KosarTetel } from '../models/kosar-tetel.model';
import { BasketService } from './basket.service';
import { forwardRef, Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  getPreviousOrders(email: string): Rendeles[] {
    const ordersJson = localStorage.getItem(`orders_${email}`);
    if (ordersJson) {
      const orders = JSON.parse(ordersJson);
      return orders.map((order: any) => ({
        id: order.id,
        felhasznaloId: order.felhasznaloId,
        tetelek: order.tetelek,
        osszeg: order.osszeg
      }));
    }
    return [];
  }
  addOrder(email: string, items: KosarTetel[]) {
    const existingOrders = this.getPreviousOrders(email);
  
    const osszeg = items.reduce((sum, item) =>
      sum + item.dekoracio.ar * (item.mennyiseg || 1), 0);
  
    const newOrder: Rendeles = {
      id: Date.now(),
      felhasznaloId: 1,
      tetelek: items,
      osszeg
    };
  
    existingOrders.push(newOrder);
    localStorage.setItem(`orders_${email}`, JSON.stringify(existingOrders));
  }
  


  private users: User[] = [];
  private loggedInUser: User | null = null;
  
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable();
  
  constructor( 
    @Inject(forwardRef(() => BasketService)) private basketService: BasketService, private router: Router
  ) {

    
    this.loadUsers();
    this.loadLoggedInUser();
    this.loggedIn.next(this.loggedInUser !== null);
    console.log("Auth service initialized, logged in:", this.isLoggedIn());
  }



  

  private saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  private loadUsers() {
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      this.users = JSON.parse(usersJson);
    }
  }

  private saveLoggedInUser() {
    if (this.loggedInUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser));
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }

  private loadLoggedInUser() {
    const userJson = localStorage.getItem('loggedInUser');
    if (userJson) {
      this.loggedInUser = JSON.parse(userJson);
    }
  }

  isLoggedIn(): boolean {
    return this.loggedInUser !== null;
  }

  register(user: User): boolean {
    const exists = this.users.some(u => u.email === user.email);
    if (exists) return false;

    this.users.push(user);
    this.saveUsers();
    return true;
  }

  getLoggedInUser(): User | null {
    return this.loggedInUser;
  }

  getCurrentUser(): User | null {
    return this.loggedInUser;
  }

  updateEmail(newEmail: string): boolean {
    if (!this.loggedInUser) return false;
    if (this.users.some(u => u.email === newEmail)) return false;

    this.loggedInUser.email = newEmail;
    this.saveUsers();
    this.saveLoggedInUser();
    return true;
  }

  updatePassword(currentPassword: string, newPassword: string): boolean {
    if (!this.loggedInUser || this.loggedInUser.password !== currentPassword) return false;
  
    this.loggedInUser.password = newPassword;
  
    const index = this.users.findIndex(u => u.email === this.loggedInUser!.email);
    if (index !== -1) {
      this.users[index].password = newPassword;
    }
  
    this.saveUsers();
    this.saveLoggedInUser();
    return true;
  }

  login(email: string, password: string): boolean {
    const found = this.users.find(u => u.email === email && u.password === password);
    if (found) {
      this.loggedInUser = found;
      this.saveLoggedInUser();
      this.loggedIn.next(true); // <- FONTOS!
      console.log("User logged in successfully");
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedInUser = null;
    this.saveLoggedInUser();
    this.loggedIn.next(false);
    console.log("User logged out");
    this.router.navigate(['/aboutus']);
    this.basketService.clearBasket(); // 💡 Már működni fog
  }
}