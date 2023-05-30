// Iniciar componente de angular

import { Component, OnInit, Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import { ScrappingService } from 'src/app/services/scrapping.service';

import { ThemeService } from '../../services/theme.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ ScrappingService]
})
export class HeaderComponent implements OnInit{

  checked: boolean = false;
  items: MenuItem[] = [
    {
      label: 'Goleadores',
      // icon: 'pi pi-fw pi-home',
      routerLink: '/'
    },
    {
      label: 'Fair Play',
      // icon: 'pi pi-fw pi-users',
      routerLink: '/fairplay'
    }
  ];

  constructor(
    private router: Router,
    private scrappingService: ScrappingService,
    private themeService: ThemeService,
  ) {

  }

  ngOnInit(): void {

  }

  changeTheme(event: any) {
    console.log(event);
    // return;
    this.themeService.switchTheme(event.checked);
  }

}


