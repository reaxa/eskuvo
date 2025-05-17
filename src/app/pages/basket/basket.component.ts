import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketService } from '../../services/basket.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KosarTetel } from '../../models/kosar-tetel.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginAlertDialog } from '../../login-alert-dialog.component'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PaymentSuccessDialog } from './payment-success-dialog.component';
import { FtFormatPipe } from '../../pipes/ftFormat.pipe';
import { BasketItemComponent } from './basket-item.component';

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
    LoginAlertDialog,     
    PaymentSuccessDialog,
    MatSnackBarModule,
    FtFormatPipe,
    BasketItemComponent     
  ],
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent {
  constructor(
    public basketService: BasketService,
    private dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  get kosar() {
    return this.basketService.getBasket();
  }

  increase(tetel: KosarTetel) {
    this.basketService.increase(tetel);
  }

  decrease(tetel: KosarTetel) {
    this.basketService.decrease(tetel);
  }

  get total(): number {
    return this.basketService.getTotal();
  }

  
remove(tetel: KosarTetel) {
  this.basketService.removeItem(tetel);
}



  fizetes() {
    if (this.kosar.length === 0) {
      this.snackBar.open('A kosár üres. Kérlek, adj hozzá termékeket!', 'Bezárás', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }
  
    if (!this.authService.isLoggedIn()) {
      this.dialog.open(LoginAlertDialog);
      return;
    }
  
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.authService.addOrder(user.email, this.kosar);
    }
  
    this.basketService.completeOrder();
    this.dialog.open(PaymentSuccessDialog);
  }


}
export { PaymentSuccessDialog};