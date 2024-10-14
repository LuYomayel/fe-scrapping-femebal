// Iniciar componente de angular

import { Component, OnInit, Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import { ScrappingService } from 'src/app/services/scrapping.service';

import { ThemeService } from '../../services/theme.service';
import { MenuItem } from 'primeng/api';
export interface Torneo{
  year: number;
  tipo: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ScrappingService]
})
export class HeaderComponent implements OnInit{

  torneos: any[] = [];
  checked: boolean = false;
  items: MenuItem[] = [
    {
      label: 'Torneos',
      // icon: 'pi pi-fw pi-home',

      items: []
    },
    {
      label: 'Estadisticas',
      // icon: 'pi pi-fw pi-users',
      routerLink: '/estadisticas'
    },
    {
      label: 'Historial de Goleadores',
      // icon: 'pi pi-fw pi-users',
      routerLink: '/historial-goleadores',
      badge: 'new'
    },
    {
      label: 'Cafecito',
      // icon: 'pi pi-fw pi-home',
      routerLink: '/cafecito'
    },
    // {
    //   label: 'Fair Play',
    //   // icon: 'pi pi-fw pi-users',
    //   routerLink: '/fairplay'
    // }
  ];

  constructor(
    private router: Router,
    private scrappingService: ScrappingService,
    private themeService: ThemeService,
  ) {

  }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    const torneosData = await this.getTorneos()

    const items = torneosData.map((torneo: Torneo) => {
      return {
        label: `${torneo.tipo} ${torneo.year}`,
        items: [
          {
            label: 'Goleadores',
            routerLink: `/goleadores/torneo/${torneo.year}/${torneo.tipo}`
          },
          {
            label: 'Fair Play',
            routerLink: `/fairplay/torneo/${torneo.year}/${torneo.tipo}`
          },
        ]
      }
    });


    this.items[0].items = [...items];
    console.log(items);
  }
  changeTheme(event: any) {
    console.log(event);
    // return;
    this.themeService.switchTheme(event.checked);
  }

  async getTorneos() : Promise<Torneo[]>{
    return await new Promise((resolve, reject) => {
      this.scrappingService.getTorneos().subscribe({
        next: (res: any) => {
          resolve(res);
        },
        error: (err: any) => {
          reject([]);
        }

      });
    });
  }

}


