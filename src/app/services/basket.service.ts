import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KosarTetel } from '../models/kosar-tetel.model';
import { Dekoracio } from '../models/dekoracio.model';
import { BasketStorageService } from './basket-storage.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private kosar: KosarTetel[] = [];
  private rendelesek: { items: KosarTetel[], date: Date }[] = [];

  private currentUserEmail: string | null = null;
  private authService!: AuthService;

  kosarSubject = new BehaviorSubject<KosarTetel[]>([]);

  constructor(
    private basketStorage: BasketStorageService,
    private injector: Injector
  ) {
    // Késleltetett AuthService injektálás (ciklikus hiba elkerülése)
    setTimeout(() => {
      this.authService = this.injector.get(AuthService);
      const user = this.authService.getLoggedInUser();
      this.currentUserEmail = user?.email || null;
      this.loadBasket();
    });
  }

  private loadBasket() {
    if (this.currentUserEmail) {
      const saved = localStorage.getItem(`basket_${this.currentUserEmail}`);
      if (saved) {
        this.kosar = JSON.parse(saved);
        this.kosarSubject.next(this.kosar);
      } else {
        this.kosar = [];
        this.kosarSubject.next([]);
      }
    } else {
      this.kosar = [];
      this.kosarSubject.next([]);
    }
  }

  private saveBasket() {
    if (this.currentUserEmail) {
      localStorage.setItem(`basket_${this.currentUserEmail}`, JSON.stringify(this.kosar));
    }
  }

  getBasket(): KosarTetel[] {
    return this.kosar;
  }

  addToBasket(dekor: Dekoracio) {
    const found = this.kosar.find(t => t.dekoracio.id === dekor.id);
    if (found) {
      found.mennyiseg++;
    } else {
      this.kosar.push({ dekoracio: dekor, mennyiseg: 1 });
    }
    this.kosarSubject.next(this.kosar);
    this.saveBasket();
  }

  increase(tetel: KosarTetel) {
    tetel.mennyiseg++;
    this.kosarSubject.next(this.kosar);
    this.saveBasket();
  }

  decrease(tetel: KosarTetel) {
    tetel.mennyiseg--;
    if (tetel.mennyiseg <= 0) {
      this.kosar = this.kosar.filter(t => t !== tetel);
    }
    this.kosarSubject.next(this.kosar);
    this.saveBasket();
  }

  clearBasket() {
    this.kosar = [];
    this.kosarSubject.next([]);
    this.saveBasket();
  }

  getTotal(): number {
    return this.kosar.reduce((sum, t) => sum + t.dekoracio.ar * t.mennyiseg, 0);
  }

  completeOrder() {
    if (this.kosar.length > 0) {
      const user = this.authService?.getLoggedInUser();
      if (user) {
        const copy = this.kosar.map(t => ({
          dekoracio: { ...t.dekoracio },
          mennyiseg: t.mennyiseg,
        }));
        this.authService.addOrder(user.email, copy);
      }
      this.clearBasket();
    }
  }

  getPreviousOrders(): { items: KosarTetel[], date: Date }[] {
    return this.rendelesek;
  }
}
