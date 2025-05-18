import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, query, where, orderBy, collectionData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { serverTimestamp } from 'firebase/firestore';

import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword
} from '@angular/fire/auth';

import { sendEmailVerification, updateProfile } from 'firebase/auth';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

import { KosarTetel } from '../models/kosar-tetel.model';
import { Rendeles } from '../models/rendeles.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable();

  private userSubject = new BehaviorSubject<User | null | undefined>(undefined);
  public user$ = this.userSubject.asObservable();

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {
    this.auth.onAuthStateChanged(user => {
      this.userSubject.next(user);
      this.loggedIn.next(!!user);
    });
  }

  async register(email: string, password: string, name: string): Promise<{ success: boolean; message: string }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName: name });

        try {
          await sendEmailVerification(user);
        } catch (error) {
          console.error('Email verification sending failed:', error);
        }
      }

      return {
        success: true,
        message: 'Sikeres regisztráció. Kérlek ellenőrizd az email címed és erősítsd meg azt.',
      };
    } catch (error: any) {
      console.error('Regisztrációs hiba:', error);
      let message = 'Ismeretlen hiba történt.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Ez az email cím már használatban van.';
          break;
        case 'auth/invalid-email':
          message = 'Hibás email cím.';
          break;
        case 'auth/weak-password':
          message = 'A jelszónak legalább 6 karakter hosszúnak kell lennie.';
          break;
      }

      return { success: false, message };
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      const userBeforeLogout = this.auth.currentUser;
      await signOut(this.auth);
      console.log('User logged out:', userBeforeLogout?.email);
      this.router.navigate(['/aboutus']);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  getLoggedInUser(): User | null {
    return this.userSubject.value ?? null;
  }

  async reauthenticate(currentPassword: string): Promise<boolean> {
    try {
      const user = this.auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        return true;
      }
    } catch (error) {
      console.error('Reauthentication failed:', error);
      alert('Újra-hitelesítés sikertelen: ' + (error as any).message);
    }
    return false;
  }

  async updateEmail(newEmail: string, currentPassword: string): Promise<{ success: boolean; message: string }> {
    const user = this.auth.currentUser;

    if (!user || !user.email) {
      return { success: false, message: 'Nincs bejelentkezett felhasználó.' };
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      console.error('Újrahitelesítés sikertelen:', error);
      return {
        success: false,
        message: 'Hibás jelenlegi jelszó, nem sikerült újrahitelesíteni.'
      };
    }

    try {
      await fbUpdateEmail(user, newEmail);
      return {
        success: true,
        message: 'Az email cím sikeresen frissítve.'
      };
    } catch (error: any) {
      console.error('Email frissítési hiba:', error);
      let message = 'Ismeretlen hiba történt.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Ez az email cím már használatban van.';
          break;
        case 'auth/invalid-email':
          message = 'Hibás email formátum.';
          break;
        case 'auth/operation-not-allowed':
          message = 'Az email frissítés nincs engedélyezve.';
          break;
        case 'auth/requires-recent-login':
          message = 'Újrahitelesítés szükséges. Jelentkezz be újra.';
          break;
      }

      return { success: false, message };
    }
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return { success: false, message: 'Nincs bejelentkezett felhasználó.' };
      }

      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await fbUpdatePassword(user, newPassword);
      return { success: true, message: 'A jelszó sikeresen frissítve.' };
    } catch (error: any) {
      console.error("Password update failed:", error);
      let message = 'Ismeretlen hiba történt a jelszó frissítésekor.';

      switch (error.code) {
        case 'auth/weak-password':
          message = 'A jelszónak legalább 6 karakter hosszúnak kell lennie.';
          break;
        case 'auth/requires-recent-login':
          message = 'Újrahitelesítés szükséges. Jelentkezz be újra.';
          break;
      }

      return { success: false, message };
    }
  }


  async addOrder(items: KosarTetel[]): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.uid) {
      throw new Error('Nincs bejelentkezett felhasználó a rendeléshez.');
    }

    const id = doc(collection(this.firestore, 'orders')).id;
    const osszeg = items.reduce((sum, item) => sum + item.dekoracio.ar * item.mennyiseg, 0);

    const newOrder: Rendeles = {
      id,
      felhasznaloId: currentUser.uid,
      tetelek: items,
      osszeg,
    };

    const orderDocRef = doc(this.firestore, `orders/${id}`);

    try {
      await setDoc(orderDocRef, {
        ...newOrder,
        createdAt: serverTimestamp()
      });
      console.log('Rendelés sikeresen hozzáadva az adatbázishoz:', id);
    } catch (error) {
      console.error('Hiba történt a rendelés Firestore-ba írásakor:', error);
      throw error;
    }
  }

  getPreviousOrders(userId: string | null): Observable<Rendeles[]> {
    if (!userId) {
      console.warn('getPreviousOrders: Nincs userId megadva, üres rendelési listát adok vissza.');
      return new BehaviorSubject<Rendeles[]>([]).asObservable();
    }

    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('felhasznaloId', '==', userId), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Rendeles[]>;
  }
}
