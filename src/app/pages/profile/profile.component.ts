import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { FtFormatPipe } from '../../pipes/ftFormat.pipe';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

import { User } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';

import { Rendeles } from '../../models/rendeles.model';

type RendelesWithDate = Omit<Rendeles, 'createdAt'> & { createdAt: Date };

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CapitalizePipe,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    FtFormatPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  previousOrders$?: Observable<RendelesWithDate[]>;
  newEmail = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  currentPasswordForEmail = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.previousOrders$ = of([]);
  }


ngOnInit(): void {
  this.authService.user$.subscribe(user => {
    setTimeout(() => {
      this.user = user ?? null;
    });
  });

  this.previousOrders$ = this.authService.user$.pipe(
    switchMap(user => {
      if (!user) return of([] as RendelesWithDate[]);
      return this.authService.getPreviousOrders(user.uid).pipe(
        map(orders =>
          orders.map(order => {
            const createdAt = order.createdAt instanceof Timestamp
              ? order.createdAt.toDate()
              : (order.createdAt ?? new Date());
            return { ...order, createdAt } as RendelesWithDate;
          })
        )
      );
    })
  );
}


  get displayName(): string {
    if (!this.user) return 'Név nincs megadva';
    return this.user.displayName ?? this.user.email ?? 'Név nincs megadva';
  }

  async updateEmail(): Promise<void> {
    if (!this.newEmail || !this.currentPasswordForEmail) {
      this.snackBar.open('Adj meg új email címet és a jelenlegi jelszavad!', 'Bezárás', { duration: 3000, panelClass: 'snackbar-warning' });
      return;
    }

    const result = await this.authService.updateEmail(this.newEmail, this.currentPasswordForEmail);

    if (result.success) {
      this.snackBar.open(result.message ?? 'Email címed frissítve lett!', 'Bezárás', {
        duration: 6000,
        panelClass: 'snackbar-success'
      });
      this.newEmail = '';
      this.currentPasswordForEmail = '';
    } else {
      this.snackBar.open(`Email frissítés sikertelen: ${result.message}`, 'Bezárás', {
        duration: 5000,
        panelClass: 'snackbar-warning'
      });
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  async updatePassword(): Promise<void> {
    if (!this.user) return;

    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('Az új jelszavak nem egyeznek!', 'Bezárás', {
        duration: 3000,
        panelClass: 'snackbar-warning'
      });
      return;
    }

    const success = await this.authService.updatePassword(this.currentPassword, this.newPassword);
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
