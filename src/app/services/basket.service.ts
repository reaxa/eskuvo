import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { switchMap, tap, distinctUntilChanged, filter, catchError } from 'rxjs/operators';
import { KosarTetel } from '../models/kosar-tetel.model';
import { Dekoracio } from '../models/dekoracio.model';
import { BasketFirestoreService } from './basket-storage.service';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class BasketService implements OnDestroy {
  private kosarSubject = new BehaviorSubject<KosarTetel[]>([]);
  kosar$: Observable<KosarTetel[]> = this.kosarSubject.asObservable();

  private currentUserId: string | null = null;
  private authSubscription: Subscription;
  private firestoreBasketSubscription?: Subscription;

  constructor(
    private basketFirestoreService: BasketFirestoreService,
    private authService: AuthService
  ) {
    this.authSubscription = this.authService.user$.pipe(
    ).subscribe(user => {
      this.handleUserChange(user);
    });
  }

  private handleUserChange(user: User | null | undefined): void {
    if (this.firestoreBasketSubscription) {
      this.firestoreBasketSubscription.unsubscribe();
      this.firestoreBasketSubscription = undefined;
      console.log('BasketService: Unsubscribed from previous Firestore basket listener.');
    }

    const newUserId = user?.uid || null;

    if (newUserId) {
      if (this.currentUserId !== newUserId) {
        console.log(`BasketService: User changed or logged in. New User ID: ${newUserId}. Loading basket.`);
        this.currentUserId = newUserId;
        
        this.firestoreBasketSubscription = this.basketFirestoreService.loadBasket(this.currentUserId).pipe(
          catchError(err => {
            console.error(`BasketService: Error loading basket for user ${this.currentUserId} from Firestore:`, err);
            return of([]);
          })
        ).subscribe({
          next: (items) => {
            console.log(`BasketService: Basket loaded from Firestore for user ${this.currentUserId}:`, items.length, 'items');
            this.kosarSubject.next(items || []);
          }
        
        });
      } else {
        console.log(`BasketService: User is the same (${newUserId}), no need to reload basket unless forced.`);
      }
    } else {
      console.log('BasketService: User logged out or no user. Clearing local basket.');
      this.currentUserId = null;
      this.kosarSubject.next([]);

    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.firestoreBasketSubscription) {
      this.firestoreBasketSubscription.unsubscribe();
    }
    console.log('BasketService destroyed, subscriptions cleaned up.');
  }

  addToBasket(dekor: Dekoracio): void {
    const currentBasket = [...this.kosarSubject.getValue()];
    const existingItemIndex = currentBasket.findIndex(t => t.dekoracio.id === dekor.id);

    if (existingItemIndex > -1) {
      currentBasket[existingItemIndex] = {
        ...currentBasket[existingItemIndex],
        mennyiseg: currentBasket[existingItemIndex].mennyiseg + 1
      };
    } else {
      currentBasket.push({ dekoracio: dekor, mennyiseg: 1 });
    }
    this.kosarSubject.next(currentBasket);
    this.saveBasketToFirestore("addToBasket");
  }

  increase(tetel: KosarTetel): void {
    const currentBasket = [...this.kosarSubject.getValue()];
    const itemIndex = currentBasket.findIndex(t => t.dekoracio.id === tetel.dekoracio.id);
    if (itemIndex > -1) {
      currentBasket[itemIndex].mennyiseg++;
      this.kosarSubject.next(currentBasket);
      this.saveBasketToFirestore("increase");
    }
  }

  decrease(tetel: KosarTetel): void {
    let currentBasket = [...this.kosarSubject.getValue()];
    const itemIndex = currentBasket.findIndex(t => t.dekoracio.id === tetel.dekoracio.id);
    if (itemIndex > -1) {
      currentBasket[itemIndex].mennyiseg--;
      if (currentBasket[itemIndex].mennyiseg <= 0) {
        currentBasket = currentBasket.filter(t => t.dekoracio.id !== tetel.dekoracio.id);
      }
      this.kosarSubject.next(currentBasket);
      this.saveBasketToFirestore("decrease/remove_if_zero");
    }
  }

  removeItem(tetel: KosarTetel): void {
    const updatedBasket = this.kosarSubject.getValue().filter(t => t.dekoracio.id !== tetel.dekoracio.id);
    this.kosarSubject.next(updatedBasket);
    this.saveBasketToFirestore("removeItem");
  }

  private saveBasketToFirestore(sourceOperation: string = "unknown"): void {
    if (this.currentUserId) {
      console.log(`BasketService: Attempting to save basket to Firestore for user ${this.currentUserId} (Operation: ${sourceOperation})`, this.kosarSubject.getValue().length, 'items');
      this.basketFirestoreService.saveBasket(this.currentUserId, this.kosarSubject.getValue())
        .then(() => console.log(`BasketService: Basket successfully synced to Firestore for user ${this.currentUserId} after ${sourceOperation}.`))
        .catch(err => console.error(`BasketService: Failed to sync basket to Firestore for user ${this.currentUserId} after ${sourceOperation}:`, err));
    } else {
      console.warn(`BasketService: No user logged in, basket not saved to Firestore (Operation: ${sourceOperation}). (Local/guest basket changes only)`);

    }
  }

  getBasket(): KosarTetel[] {
    return this.kosarSubject.getValue();
  }

  getTotal(): number {
    return this.kosarSubject.getValue().reduce((sum, t) => sum + (t.dekoracio.ar * t.mennyiseg), 0);
  }

  completeOrderAndClearBasket(): void {
    console.log('BasketService: Order completed. Clearing local and Firestore basket.');
    this.kosarSubject.next([]); 
    if (this.currentUserId) {
      this.basketFirestoreService.clearBasket(this.currentUserId)
        .then(() => console.log(`BasketService: Firestore basket cleared successfully for user ${this.currentUserId} after order.`))
        .catch(err => console.error(`BasketService: Failed to clear Firestore basket for user ${this.currentUserId} after order.`, err));
    } else {
      console.warn('BasketService: No user was logged in when trying to clear Firestore basket after order.');
    }
  }

  setBasket(items: KosarTetel[]): void {
    console.log('BasketService: Manually setting basket with', items.length, 'items.');
    this.kosarSubject.next(items || []);
    this.saveBasketToFirestore("setBasket_manual"); 
  }
}
