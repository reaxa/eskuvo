import { Component, OnInit } from '@angular/core';
import { Dekoracio } from '../../models/dekoracio.model';
import { BasketService } from '../../services/basket.service';
import { CardsComponent } from '../../cards/cards.component';
import { AuthService } from '../../services/auth.service'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { LoginAlertDialog } from '../../login-alert-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CardsComponent, MatDialogModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  dekoraciok: Dekoracio[] = [
    {
      id: 1,
      nev: 'Virágkoszorú',
      leiras: 'Színes virágkoszorú.',
      ar: 4500,
      kepUrl: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQou0fI4q8of4FUMTsTHCTYmQL2rmwn0HQ8EmE4qAA8YXRBXXeWmA6PJKVOOb_qxO5VjBDT9nzyTOQSjGLizMdNyezfbcul7E3xs8TTvw84dogBq1ZaYODFeXLlVgHXHBPFqBGUcQ&usqp=CAc',
    },
    {
      id: 2,
      nev: 'Gyertyatartó',
      leiras: 'Elegáns gyertyatartó.',
      ar: 3200,
      kepUrl: 'https://gardos.hu/wp-content/uploads/2023/07/6151ver-haromagu-gyertyatarto.jpg',
    },
    {
      id: 3,
      nev: 'Asztaldísz Rózsákkal',
      leiras: 'Letisztult fehér rózsadísz.',
      ar: 3800,
      kepUrl: 'https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/151411aba4ce17fc8c73d18b00b69a24.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp',
    },
    {
      id: 4,
      nev: 'Kis Csokor',
      leiras: 'Dekoratív kis csokor ajándékba.',
      ar: 2900,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    },
    {
      id: 5,
      nev: 'Vintage Dísz',
      leiras: 'Régi idők hangulatát idézi.',
      ar: 3100,
      kepUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPObF4XKbiGW4jyxEhzi286a-l2vK6XlOK9g&s',
    },
    {
      id: 6,
      nev: 'Esküvői Középdísz',
      leiras: 'Tökéletes esküvői dekoráció.',
      ar: 5500,
      kepUrl: 'https://img.kwcdn.com/product/open/2024-09-06/1725629075631-d2d66f024b33425db3be8a7f8d864b7b-goods.jpeg?imageView2/2/w/500/q/60/format/webp',
    },
    {
      id: 7,
      nev: 'Tavaszi Kompozíció',
      leiras: 'Üde, színes tavaszi csoda.',
      ar: 3300,
      kepUrl: 'https://a.allegroimg.com/original/118ac0/fd9aeddd481f8262a988ceaa6fc4/Tavaszi-dekoracio-kompozicio-asztaldisz',
    },
    {
      id: 8,
      nev: 'Karácsonyi Dísz',
      leiras: 'Fenyőillat és ünnepi hangulat.',
      ar: 3600,
      kepUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRrZoQDQWZbugIKhBO4VEDNMqL0Fj75Wub1Q&s',
    },
    {
      id: 9,
      nev: 'Őszi Kosár',
      leiras: 'Tökéletes dísz októberre.',
      ar: 3700,
      kepUrl: 'https://www.firstdecor.hu/img/80191/Y672GREY/238x238,r/Y672GREY.jpg?time=1713868791',
    },
    {
      id: 10,
      nev: 'Romantikus Asztaldísz',
      leiras: 'Romantikus vacsorákhoz.',
      ar: 4100,
      kepUrl: 'https://lorato.hu/img/43221/L121565/500x500/L121565.webp?time=1705588642',
    },
    {
      id: 11,
      nev: 'Modern Dísz',
      leiras: 'Minimalista stílusban.',
      ar: 3000,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    },
    {
      id: 12,
      nev: 'Esküvői Csokor',
      leiras: 'Elegáns menyasszonyi csokor.',
      ar: 5900,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    },
    {
      id: 13,
      nev: 'Díszpárna Mellévaló',
      leiras: 'Hangulatos kiegészítő.',
      ar: 2200,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    },
    {
      id: 14,
      nev: 'Fehér Kompozíció',
      leiras: 'Fehér virágok harmóniája.',
      ar: 4700,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    },
    {
      id: 15,
      nev: 'Mini Váza',
      leiras: 'Asztal közepére álmodva.',
      ar: 1900,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    },
    {
      id: 16,
      nev: 'Ajtódísz',
      leiras: 'Üdvözöld vendégeid stílusosan.',
      ar: 2800,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    },
    {
      id: 17,
      nev: 'Bohém Kompozíció',
      leiras: 'Szabad stílusú virágdísz.',
      ar: 3500,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    },
    {
      id: 18,
      nev: 'Pasztell Dísz',
      leiras: 'Visszafogott, elegáns színek.',
      ar: 1900,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    },
    {
      id: 19,
      nev: 'Lila Csoda',
      leiras: 'A lila minden árnyalatában.',
      ar: 4500,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    },
    {
      id: 20,
      nev: 'Téli Elegancia',
      leiras: 'Fehér és ezüst kombinációja.',
      ar: 1000,
      kepUrl: 'https://escadaviragkuldes.hu/storage/optimized-images/shares/termekkepek/feher_rozsacsokor_800-large.webp',
    }
  ];
  
  constructor(
    private basketService: BasketService,
    private authService: AuthService,
    private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.dialog.open(LoginAlertDialog);
    }
  }

  addToBasket(dekor: Dekoracio) {
    if (!this.authService.isLoggedIn()) {
      this.dialog.open(LoginAlertDialog);
      return;
    }
    
    console.log('Kosárhoz adás:', dekor);
    this.basketService.addToBasket(dekor);
  }
}