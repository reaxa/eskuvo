import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'payment-success-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Sikeres fizetés</h2>
    <mat-dialog-content>
      <p>Köszönjük a rendelést! Rendelésed rögzítettük.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>OK</button>
    </mat-dialog-actions>
  `
})
export class PaymentSuccessDialog {}
