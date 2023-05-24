// Iniciar componente de angular

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem  } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ScrappingService } from 'src/app/services/scrapping.service';
import * as moment from 'moment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ ScrappingService]
})
export class HeaderComponent implements OnInit{
  fechaActualizacion: string = '';
  constructor(
    private router: Router,
    private scrappingService: ScrappingService
  ) { }

  ngOnInit(): void {
    this.scrappingService.getUltimaActualizacion().subscribe( res => {
      const date = new Date(res.ultima_actualizacion);
      this.fechaActualizacion = moment(date).format('DD/MM/YYYY - HH:mm:ss');

    });
    // throw new Error('Method not implemented.');
  }

}


