import { Injectable, NgZone } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, docData, serverTimestamp } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { KosarTetel } from '../models/kosar-tetel.model';

interface BasketDocument { 
  items: KosarTetel[];
  updatedAt: any; 
}

@Injectable({ providedIn: 'root' })
export class BasketFirestoreService {

  constructor(private firestore: Firestore, private ngZone: NgZone) {}

  loadBasket(userId: string): Observable<KosarTetel[]> {
    if (!userId) {
      console.warn('BasketFirestoreService loadBasket: No userId provided.');
      return of([]);
    }
    const docRef = doc(this.firestore, `baskets/${userId}`);
    return docData(docRef).pipe(
      map((data: any) => { 
        if (data && data.items) {
          console.log(`BasketFirestoreService: Basket loaded for user ${userId}`, data.items);
          return data.items as KosarTetel[];
        }
        console.log(`BasketFirestoreService: No basket found or empty for user ${userId}.`);
        return []; 
      }),
      catchError(error => {
        console.error(`BasketFirestoreService: Error loading basket for user ${userId}:`, error);
        return of([]);
      }),
    );
  }

  saveBasket(userId: string, kosar: KosarTetel[]): Promise<void> {
    if (!userId) {
      console.error('BasketFirestoreService saveBasket: No userId provided.');
      return Promise.reject('No userId provided for saving basket.');
    }
    const docRef = doc(this.firestore, `baskets/${userId}`);
    const data: BasketDocument = {
      items: kosar,
      updatedAt: serverTimestamp()
    };
    console.log(`BasketFirestoreService: Saving basket for user ${userId}`, data);
    return setDoc(docRef, data, { merge: true })
      .then(() => console.log(`BasketFirestoreService: Basket saved successfully for user ${userId}.`))
      .catch(error => {
        console.error(`BasketFirestoreService: Error saving basket for user ${userId}:`, error);
        throw error; 
      });
  }

  clearBasket(userId: string): Promise<void> {
    if (!userId) {
      console.error('BasketFirestoreService clearBasket: No userId provided.');
      return Promise.reject('No userId provided for clearing basket.');
    }
    const docRef = doc(this.firestore, `baskets/${userId}`);

    const data: Partial<BasketDocument> = { 
        items: [],
        updatedAt: serverTimestamp()
    };
    console.log(`BasketFirestoreService: Clearing basket for user ${userId}`);
    return setDoc(docRef, data, { merge: true })
      .then(() => console.log(`BasketFirestoreService: Basket cleared successfully for user ${userId}.`))
      .catch(error => {
        console.error(`BasketFirestoreService: Error clearing basket for user ${userId}:`, error);
        throw error;
      });
  }
}