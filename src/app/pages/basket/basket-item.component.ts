import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FtFormatPipe } from '../../pipes/ftFormat.pipe';

@Component({
  selector: 'app-basket-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FtFormatPipe
  ],
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.css']
})
export class BasketItemComponent {
  @Input() nev!: string;
  @Input() ar!: number;
  @Input() mennyiseg!: number;

  @Output() noveles = new EventEmitter<void>();
  @Output() csokkentes = new EventEmitter<void>();
  @Output() torles = new EventEmitter<void>();
}
