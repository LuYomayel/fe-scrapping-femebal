import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ScrappingService } from '../services/scrapping.service';
import { Message, MessageService } from 'primeng/api';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import { Torneo } from '../main/header/header.component';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-fairplay',
  templateUrl: './fairplay.component.html',
  styleUrls: ['./fairplay.component.scss'],
  providers: [ScrappingService, MessageService]
})
export class FairPlayComponent implements OnInit, AfterViewInit {

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
  equiposFairPlay: any[] = [];
  guardarTabla: any[] = [];
  equipoSeleccionado: any;
  filtroGeneral: any[] =[
    { label: 'Categoría', value: 'categoria' },
    { label: 'Equipo', value: 'equipo' },
    { label: 'Jugador', value: 'jugador' },
  ]
  selectedFiltro: any = this.filtroGeneral[0].value;
  filtroJugador: boolean = false;

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
    this.getTable();
    this.getEquipos();
    this.scrappingService.getUltimaActualizacion().subscribe( res => {
      const date = new Date(res.ultima_actualizacion);
      this.fechaActualizacion = moment(date).format('DD/MM/YYYY - HH:mm:ss');
    });
  }

  getTable() {
    const me = this;
    me.loading = true;
    this.scrappingService.getTableFairPlay(this.torneo).subscribe({
      next: (res: any) => {
        this.equiposFairPlay = res;
        return;
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
    if(this.selectedCategoria === 'null' || this.selectedDivision === 'null' || this.selectedGenero === 'null'){
      console.error('error');
      this.showErrorMessages('Debe completar todos los filtros');
      me.loading = false;
      return;
    }

    this.scrappingService.getTableFairPlayByCategoria(this.selectedCategoria, this.selectedDivision, this.selectedGenero, this.torneo).subscribe({
      next: (res: any) => {
        this.equiposFairPlay = res;
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

  download() {
    // const element = document.getElementById('pr_id_1-table');
    const element = document.querySelector('[id^="pr_id"][id$="-table"]') as HTMLElement;

    if (!element) {
      return;
    }

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
      link.download = 'table.png';
      link.click();
    });
  }
  equipoNombre: string = '';
  onRowSelect(event: any) {
    if(this.filtroJugador == false){
      console.log(event.data);
      this.equipoNombre = event.data.equipo.nombre;
      this.scrappingService.getTableFairPlayByEquipo(event.data.equipo._id, event.data.props.division,event.data.props.genero, event.data.props.categoria, this.torneo).subscribe({
        next: (res: any) => {
          this.guardarTabla = this.equiposFairPlay;
          this.equiposFairPlay = res;
          this.filtroJugador = true;
        }
      });
    }else{
      this.jugadorSeleccionado = event.data;
    }

  }

  jugadorSeleccionado : any = null;

  onJugadorEliminado(){
    this.jugadorSeleccionado = null;
  }
  goBack(){
    this.filtroJugador = false;
    this.equiposFairPlay = this.guardarTabla;

  }
  onRowUnselect(event: any) {
  }

  showErrorMessages(mensaje: string) {
    this.messages = [];
    this.messages.push({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 });
  }
}
