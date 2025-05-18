import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, Observable, filter } from 'rxjs';
import { KosarTetel } from '../../models/kosar-tetel.model';
import { AuthService } from '../../services/auth.service';
import { BasketService } from '../../services/basket.service';
import { LoginAlertDialog } from '../../login-alert-dialog.component'; 
import { PaymentSuccessDialog } from './payment-success-dialog.component';
import { FtFormatPipe } from '../../pipes/ftFormat.pipe';
import { BasketItemComponent } from './basket-item.component';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    FtFormatPipe,
    BasketItemComponent
  ],
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit, OnDestroy {
  kosar$: Observable<KosarTetel[]>;
  private userSubscription: Subscription;
  private currentUser: User | null = null;

  constructor(
    public basketService: BasketService,
    private dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.kosar$ = this.basketService.kosar$;
  this.userSubscription = this.authService.user$.pipe(
      filter(user => user !== undefined) 
    ).subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    console.log('BasketComponent ngOnInit: Subscribed to basketService.kosar$');
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  increase(tetel: KosarTetel) {
    this.basketService.increase(tetel);
  }

  decrease(tetel: KosarTetel) {
    this.basketService.decrease(tetel);
  }

  remove(tetel: KosarTetel) {
    this.basketService.removeItem(tetel);
  }

  async fizetes() {
    const currentBasket = this.basketService.getBasket(); 

    if (currentBasket.length === 0) {
      this.snackBar.open('A kosár üres. Kérlek, adj hozzá termékeket!', 'Bezárás', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }

    if (!this.currentUser) {
      this.dialog.open(LoginAlertDialog);
      return;
    }

    if (!this.currentUser.email) { 
      this.snackBar.open('Hiba történt: a felhasználónak nincs regisztrált email címe a fizetéshez.', 'Bezárás', {
        duration: 4000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    try {
      console.log('Fizetés kezdeményezve a következő tételekkel:', currentBasket);
      await this.authService.addOrder(currentBasket);
      
      this.basketService.completeOrderAndClearBasket(); 
      
      this.dialog.open(PaymentSuccessDialog);
      console.log('Rendelés sikeresen feldolgozva, kosár ürítve.');

    } catch (error) {
      console.error('Hiba történt a rendelés feldolgozása vagy a kosár ürítése közben:', error);
      this.snackBar.open('Hiba történt a rendelés feldolgozásakor. Próbáld újra később.', 'Bezárás', {
        duration: 5000, 
        panelClass: ['snackbar-error']
      });
    }
  }
}
