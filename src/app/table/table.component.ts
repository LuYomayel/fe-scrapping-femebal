import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrappingService } from '../services/scrapping.service';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [ScrappingService, MessageService]
})
export class TableComponent implements OnInit, AfterViewInit {

  goleadores: any[] = [];
  categorias: any[] = [
    { label: 'Elegir Categoría...', value: 'null' },
    { label: 'Mayores', value: 'Mayores' },
    { label: 'Juniors', value: 'Junior' },
    { label: 'Juveniles', value: 'Juveniles' },
    { label: 'Cadetes', value: 'Cadetes' },
    { label: 'Menores', value: 'Menores' },
    { label: 'Infantiles', value: 'Infantiles' },
  ];
  divisionesMayores: any[] = [
    { label: 'Elegir División...', value: 'null' },
    { label: 'LHC Oro', value: 'Liga de Honor Oro' },
    { label: 'LHC Plata', value: 'Liga de Honor Plata' },
    { label: 'Primera', value: '1°' },
    { label: 'Segunda', value: '2°' },
    { label: 'Tercera', value: '3°' },
  ];
  divisionesInferiores: any[] = [
    { label: 'Elegir División...', value: 'null' },
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ];
  generos: any[] = [
    { label: 'Elegir Rama...', value: 'null' },
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' },
  ];
  equipos: any[] = [];
  filtroGeneral: any[] =[
    { label: 'Categoría', value: 'categoria' },
    { label: 'Equipo', value: 'equipo' },
    { label: 'Jugador', value: 'jugador' },
  ]
  selectedFiltro: any = this.filtroGeneral[0].value;

  buscarJugador: string = '';
  selectedDivision: any = this.divisionesMayores[0].value;
  selectedCategoria: any = this.categorias[0].value;
  selectedGenero: any = this.generos[0].value;
  selectedEquipo: any;

  loading: boolean = false;

  mensajeError: boolean = false;
  messages: Message[] = [];
  constructor(
    protected router: Router,
    protected scrappingService: ScrappingService,
    protected messageService: MessageService
  ) {
    console.log('selectedFiltro', this.selectedFiltro);
  }
  ngAfterViewInit(): void {
    this.messageService.add({key: 'tl', severity:'warn', summary:'Aviso', detail:'Todos los datos referentes a los goles son recopilados directamente a partir de las planillas digitales. Si existen discrepancias en el recuento de goles, es decir, si se observan más o menos goles de los que se esperaba, es importante notar que estos inconvenientes están fuera de mi alcance y control.', sticky: true});
  }

  ngOnInit(): void {
    this.getTable();
    this.getEquipos();
  }

  getTable() {
    const me = this;
    me.loading = true;
    this.scrappingService.getTable().subscribe({
      next: (res: any) => {
        console.log(res);
        this.goleadores = res.goleadores;
      },
      error: (error) => {
        console.log(error);
        me.loading = false;
      },
      complete: () => {
        console.log('complete');
        me.loading = false;
      }
    });
  }

  getEquipos() {
    this.scrappingService.getEquipos().subscribe({
      next: (res: any) => {
        console.log(res);
        this.equipos = res.map((equipo: any) => {
          return {
            label: equipo.nombre,
            value: equipo._id
            };
          });
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }

  onChangeFiltro(event: any) {
    console.log('event', event);
    this.selectedFiltro = event.value;
    this.goleadores = [];
    console.log('selectedFiltro', this.selectedFiltro);
  }

  filtrarPorCategoria(){
    const me = this;
    me.loading = true;
    if(this.selectedCategoria === 'null' || this.selectedDivision === 'null' || this.selectedGenero === 'null'){
      console.log('error');
      this.showErrorMessages('Debe completar todos los filtros');
      me.loading = false;
      return;
    }

    this.scrappingService.getTableByCategoria(this.selectedCategoria, this.selectedDivision, this.selectedGenero).subscribe({
      next: (res: any) => {
        console.log(res);
        this.goleadores = res.goleadores;
      },
      error: (error) => {
        console.log(error);
        me.loading = false;
      },
      complete: () => {
        console.log('complete');
        me.loading = false;
      }
    });
  }

  filtarPorEquipo(){
    const me = this;
    me.loading = true;
    if(this.selectedEquipo === 'null' || this.selectedDivision === 'null' || this.selectedGenero === 'null' || this.selectedCategoria === 'null'){
      console.log('error');
      this.showErrorMessages('Debe completar todos los filtros');
      me.loading = false;
      return;
    }
    this.scrappingService.getTableByEquipo(this.selectedEquipo, this.selectedDivision, this.selectedGenero, this.selectedCategoria).subscribe({
      next: (res: any) => {
        console.log(res);
        this.goleadores = res.goleadores;
      },
      error: (error) => {
        console.log(error);
        me.loading = false;
      },
      complete: () => {
        console.log('complete');
        me.loading = false;
      }
    });
  }

  filtrarPorJugador(){
    const me = this;
    me.loading = true;
    if(this.buscarJugador === ''){
      console.log('error');
      this.showErrorMessages('Debe completar todos los filtros');
      me.loading = false;
      return;
    }
    this.scrappingService.getTableByJugador(this.buscarJugador).subscribe({
      next: (res: any) => {
        console.log(res);
        this.goleadores = res.goleadores;
      },
      error: (error) => {
        console.log(error);
        me.loading = false;
      },
      complete: () => {
        console.log('complete');
        me.loading = false;
      }
    });
  }


  showErrorMessages(mensaje: string) {
    this.messages = [];
    this.messages.push({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 });
  }
}
