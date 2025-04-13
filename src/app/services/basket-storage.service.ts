import { Injectable } from '@angular/core';
import { KosarTetel } from '../models/kosar-tetel.model';

@Injectable({ providedIn: 'root' })
export class BasketStorageService {
  loadBasket(email: string): KosarTetel[] {
    const saved = localStorage.getItem(`basket_${email}`);
    return saved ? JSON.parse(saved) : [];
  }

  saveBasket(email: string, kosar: KosarTetel[]) {
    localStorage.setItem(`basket_${email}`, JSON.stringify(kosar));
  }

  clearBasket(email: string) {
    localStorage.removeItem(`basket_${email}`);
  }
}
