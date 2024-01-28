import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ScrappingService } from '../services/scrapping.service';
import { ActivatedRoute } from '@angular/router';
import { Torneo } from '../main/header/header.component';

@Component({
  selector: 'app-cafecito',
  templateUrl: './cafecito.component.html',
  styleUrls: ['./cafecito.component.scss'],
  providers: [ ScrappingService]
})
export class CafecitoComponent implements OnInit {


  loading:boolean = false;

  constructor(
    protected scrappingService: ScrappingService,
    protected route: ActivatedRoute,
  ) {

  }



  ngOnInit(): void {
    // this.getEstadisticas();
  }

  openCafecito(){
    window.open('https://cafecito.app/luyomayel', '_blank');
  }

}
