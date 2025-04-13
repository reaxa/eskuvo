// login-alert.dialog.ts
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Bejelentkezés szükséges</h2>
    <mat-dialog-content>
      A kosár használatához előbb be kell jelentkezned!
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>OK</button>
    </mat-dialog-actions>
  `
})
export class LoginAlertDialog {}
