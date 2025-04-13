import { KosarTetel } from './kosar-tetel.model';

export interface Rendeles {
  id: number;
  felhasznaloId: number;
  tetelek: KosarTetel[];
  osszeg: number;
}
