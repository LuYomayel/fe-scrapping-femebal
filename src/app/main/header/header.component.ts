// Iniciar componente de angular

import { Component, OnInit, Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import { ScrappingService } from 'src/app/services/scrapping.service';
import * as moment from 'moment';
import { ThemeService } from '../../services/theme.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ ScrappingService]
})
export class HeaderComponent implements OnInit{
  fechaActualizacion: string = '';
  checked: boolean = false;
  constructor(
    private router: Router,
    private scrappingService: ScrappingService,
    private themeService: ThemeService,
  ) {

  }

  ngOnInit(): void {
    this.scrappingService.getUltimaActualizacion().subscribe( res => {
      const date = new Date(res.ultima_actualizacion);
      this.fechaActualizacion = moment(date).format('DD/MM/YYYY - HH:mm:ss');

    });
  }

  changeTheme(event: any) {
    console.log(event);
    // return;
    this.themeService.switchTheme(event.checked);
  }

}


