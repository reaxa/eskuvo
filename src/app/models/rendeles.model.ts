import { KosarTetel } from './kosar-tetel.model';
import { Timestamp } from '@angular/fire/firestore';

export interface Rendeles {
  id: string;
  felhasznaloId: string;
  tetelek: KosarTetel[];
  osszeg: number;
  createdAt?: Timestamp | Date;
}type RendelesWithDate = Omit<Rendeles, 'createdAt'> & { createdAt: Date };
