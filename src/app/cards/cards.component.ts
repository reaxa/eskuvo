import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dekoracio } from '../models/dekoracio.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="dekor-container">
      <mat-card *ngFor="let dekor of dekoraciok" class="dekor-card" [ngClass]="{ 'kiemelt': dekor.ar < 2000 }">
        <img mat-card-image [src]="dekor.kepUrl" alt="{{ dekor.nev }}" />
        <mat-card-title>{{ dekor.nev }}</mat-card-title>
        <mat-card-content>
          <p>{{ dekor.leiras }}</p>
          <p><strong>{{ dekor.ar }} Ft</strong></p>
        </mat-card-content>
        <mat-card-actions>
          <button *ngIf="authService.isLoggedIn$ | async" (click)="addToBasket(dekor)">
  <mat-icon>shopping_cart</mat-icon>
</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styleUrls: ['./cards.component.css']
})




export class CardsComponent {
  @Input() dekoraciok: Dekoracio[] = [];
  @Output() add = new EventEmitter<Dekoracio>();

  constructor(public authService: AuthService,   private snackBar: MatSnackBar) {} 

  
  addToBasket(dekor: Dekoracio) {
    this.add.emit(dekor);
    this.snackBar.open(`${dekor.nev} hozzáadva a kosárhoz`, 'Bezárás', {
      duration: 3000,
      panelClass: ['snackbar-success'] 
    }); 
}
}
