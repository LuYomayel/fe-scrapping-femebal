import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrappingService } from '../services/scrapping.service';
import { Message, MessageService } from 'primeng/api';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Torneo } from '../main/header/header.component';
import { filter } from 'rxjs/operators';
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
    { label: 'E', value: 'E' },
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

  fechaActualizacion: string = '';

  torneo: Torneo = {
    year: 2023,
    tipo: 'APERTURA',
  }
  constructor(
    protected router: Router,
    protected scrappingService: ScrappingService,
    protected messageService: MessageService,
    protected route: ActivatedRoute,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTorneoFromRoute();
    });

    this.updateTorneoFromRoute();

  }

  private updateTorneoFromRoute() {
    const year = this.route.snapshot.paramMap.get('year');
    const tipo = this.route.snapshot.paramMap.get('tipo');
    this.torneo.year = parseInt(year || '2023');
    this.torneo.tipo = tipo || 'APERTURA';
    this.getTable();
    this.getEquipos();
  }

  ngAfterViewInit(): void {
    this.messageService.add({key: 'tl', severity:'warn', summary:'Aviso', detail:'Todos los datos referentes a los goles son recopilados directamente a partir de las planillas digitales. Si existen discrepancias en el recuento de goles, es decir, si se observan más o menos goles de los que se esperaba, es importante notar que estos inconvenientes están fuera de mi alcance y control.', sticky: true});
  }

  ngOnInit(): void {


    this.scrappingService.getUltimaActualizacion().subscribe( res => {
      const date = new Date(res.ultima_actualizacion);
      this.fechaActualizacion = moment(date).format('DD/MM/YYYY - HH:mm:ss');
    });

    console.log(this.torneo)
  }

  getTable() {
    const me = this;
    me.loading = true;
    this.scrappingService.getTable(this.torneo).subscribe({
      next: (res: any) => {
        // this.goleadores = res.goleadores;
        this.goleadores = this.mapearJugadores(res.goleadores);
      },
      error: (error) => {
        console.log(error);
        me.loading = false;
      },
      complete: () => {
        me.loading = false;
      }
    });
  }

  getEquipos() {
    this.scrappingService.getEquipos().subscribe({
      next: (res: any) => {
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
    this.selectedFiltro = event.value;
    this.goleadores = [];
  }

  filtrarPorCategoria(){
    const me = this;
    me.loading = true;
    console.log('filtrarPorCategoria')
    if(this.selectedCategoria === 'null' || this.selectedDivision === 'null' || this.selectedGenero === 'null'){
      console.error('error');
      this.showErrorMessages('Debe completar todos los filtros');
      me.loading = false;
      return;
    }

    this.scrappingService.getTableByCategoria(this.selectedCategoria, this.selectedDivision, this.selectedGenero, this.torneo).subscribe({
      next: (res: any) => {
        this.goleadores = this.mapearJugadores(res.goleadores);
        return;
      }
      ,
      error: (error) => {
        console.log(error);
        me.loading = false;
      },
      complete: () => {
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
    this.scrappingService.getTableByEquipo(this.selectedEquipo, this.selectedDivision, this.selectedGenero, this.selectedCategoria, this.torneo).subscribe({
      next: (res: any) => {
        this.goleadores = this.mapearJugadores(res.goleadores);
        return;
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
    this.scrappingService.getTableByJugador(this.buscarJugador, this.torneo).subscribe({
      next: (res: any) => {
        this.goleadores = this.mapearJugadores(res.goleadores);
        return;
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

  mapearJugadores(jugadores:any[]){

    return jugadores.map((goleador: any, index:number) => {
      const estadisticasXFecha = goleador.estadisticasXFecha;
      let goles = 0;
      let amarillas = 0;
      let rojas = 0;
      let dosmin = 0;
      let azules = 0;
      let fechas = 0;
      for (let fecha in estadisticasXFecha) {
        goles += estadisticasXFecha[fecha].goles;
        amarillas += estadisticasXFecha[fecha].amarillas;
        rojas += estadisticasXFecha[fecha].rojas;
        dosmin += estadisticasXFecha[fecha].dosmin;
        azules += estadisticasXFecha[fecha].azules;
        fechas++;
      }
      return {
        _id: goleador._id,
        nombre: goleador.nombre,
        promedioGoles: (goles / fechas).toFixed(2),
        goles,
        fechas,
        equipo: goleador.equipo.nombre,
        categoria: goleador.categoria,
        division: goleador.division,
        cantPartidos: fechas,
      }
    }).sort((a, b) => {
      return b.goles - a.goles;
    }).map((goleador, index) => {
      return {
        ...goleador,
        posicion: index + 1
      }
    }
    )
  }

  jugadorSeleccionado : any;
  onRowSelect(event: any) {

    this.jugadorSeleccionado = event.data;
  }

  onJugadorEliminado(){
    this.jugadorSeleccionado = null;
  }
  download() {
    // const element = document.getElementById('pr_id_2-table');
    // const element = document.querySelector('[id^="pr_id"][id$="-table"]') as HTMLElement;
    const element2 = document.getElementById('tableTitle');
    const element = document.getElementById('table');
    const caption = document.getElementById('captionId');
    // const header = document.getElementById('headerId');
    const filtroUno =   document.getElementById('filtroUno');
    const filtroDos =   document.getElementById('filtroDos');
    if (!element || !caption  || !element2 || !filtroUno || !filtroDos) {
      return;
    }
    caption.classList.add('d-none' );
    filtroUno.classList.add('d-none' );
    filtroDos.classList.add('d-none' );
    element2.classList.remove('d-none' );

    html2canvas(element).then((canvas) => {
      // canvas.width = 1600 ;
      // canvas.height = 1256;
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }
      // Guarda el contexto actual
      context.save();

      // Restaura el contexto al estado original
      context.restore();

      // Convertir el canvas a imagen y descargar
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      const titulo = `${this.selectedCategoria == 'null' ? 'Mayores' : this.selectedCategoria}_${this.selectedDivision == 'null' ? 'Liga de Honor Oro' : this.selectedDivision}_${this.selectedGenero == 'null' ? 'Masculino' : this.selectedGenero}`;

      link.download = `${titulo}.png`;
      link.click();
      caption.classList.remove('d-none' );
      filtroUno.classList.remove('d-none' );
      filtroDos.classList.remove('d-none' );

      element2.classList.add('d-none' );
    });
  }
  equipoSeleccionado: any = {
    label: '',
    value: ''
  };
  equipoChange(event: any){
    this.equipoSeleccionado = this.equipos.find(equipo => equipo.value == event)
  }

  showErrorMessages(mensaje: string) {
    this.messages = [];
    this.messages.push({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 });
  }
}
