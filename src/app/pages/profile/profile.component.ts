import { Rendeles } from '../../models/rendeles.model';
import { Component, Injectable } from '@angular/core';
import { Dekoracio } from '../../models/dekoracio.model';
import { KosarTetel } from '../../models/kosar-tetel.model';
import { AuthService, User } from '../../services/auth.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizePipe, MatSnackBarModule, MatIconModule, MatCardModule, MatFormField, MatLabel],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: User | null = null;
  newEmail = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';


previousOrders: Rendeles[] = [];

constructor(private authService: AuthService,  private snackBar: MatSnackBar) {
  this.user = this.authService.getLoggedInUser();
  this.previousOrders = this.authService.getPreviousOrders(this.user?.email || '');
}
updateEmail() {
  if (this.user && this.newEmail) {
    this.authService.updateEmail(this.newEmail);
    this.user.email = this.newEmail;

    this.snackBar.open('Email címed frissítve lett!', 'Bezárás', {
      duration: 3000,
      panelClass: 'snackbar-success'
    });

    this.newEmail = '';
  } else {
    this.snackBar.open('Kérlek, adj meg egy új email címet!', 'Bezárás', {
      duration: 3000,
      panelClass: 'snackbar-warning'
    });
  }
}

  updatePassword() {
  if (!this.user) return;

  if (this.newPassword !== this.confirmPassword) {
    this.snackBar.open('Az új jelszavak nem egyeznek!', 'Bezárás', {
      duration: 3000,
      panelClass: 'snackbar-warning'
    });
    return;
  }

  const success = this.authService.updatePassword(this.currentPassword, this.newPassword);
  if (success) {
    this.snackBar.open('A jelszavad frissítve lett!', 'Bezárás', {
      duration: 3000,
      panelClass: 'snackbar-success'
    });

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  } else {
    this.snackBar.open('A jelenlegi jelszó hibás.', 'Bezárás', {
      duration: 3000,
      panelClass: 'snackbar-warning'
    });
  }
}
}
