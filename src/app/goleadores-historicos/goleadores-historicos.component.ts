import { Component, OnInit } from '@angular/core';
import { ScrappingService } from '../services/scrapping.service';
import { Message } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-goleadores-historicos',
  templateUrl: './goleadores-historicos.component.html',
  styleUrls: ['./goleadores-historicos.component.scss'],
  providers: [ScrappingService]
})
export class GoleadoresHistoricosComponent implements OnInit {

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
  filtroGeneral: any[] = [
    { label: 'Categoría', value: 'categoria' },
    { label: 'Equipo', value: 'equipo' },
  ];
  selectedFiltro: string = 'categoria';
  selectedCategoria: any = 'null';
  selectedEquipo: any = 'null';
  selectedDivision: any = 'null';
  selectedGenero: any = 'null';
  loading: boolean = false;

  mensajeError: boolean = false;
  messages: Message[] = [];

  fechaActualizacion: string = '';

  divisiones: any[] = []; // For dynamically selected divisions

  constructor(
    private scrappingService: ScrappingService
  ) { }

  ngOnInit(): void {
    this.getEquipos();
    this.getUltimaActualizacion();
    this.updateDivisiones();
  }

  getEquipos() {
    this.scrappingService.getEquipos().subscribe({
      next: (res: any) => {
        this.equipos = res.map((equipo: any) => {
          return {
            label: equipo.nombre,
            value: equipo.id
          };
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getUltimaActualizacion() {
    this.scrappingService.getUltimaActualizacion().subscribe(res => {
      const date = new Date(res.ultima_actualizacion);
      this.fechaActualizacion = moment(date).format('DD/MM/YYYY - HH:mm:ss');
    });
  }

  onChangeFiltro(event: any) {
    this.selectedFiltro = event.value;
    this.goleadores = [];
    // Reset filters when changing the main filter
    this.selectedCategoria = 'null';
    this.selectedDivision = 'null';
    this.selectedGenero = 'null';
    this.selectedEquipo = 'null';
    this.divisiones = [];
  }

  updateDivisiones() {
    if (this.selectedCategoria === 'Mayores') {
      this.divisiones = this.divisionesMayores;
    } else if (this.selectedCategoria !== 'null') {
      this.divisiones = this.divisionesInferiores;
    } else {
      this.divisiones = [
        ...this.divisionesMayores,
        ...this.divisionesInferiores
      ]
    }
    this.selectedDivision = 'null'; // Reset division selection
  }

  filtrarPorCategoria() {
    // if (this.selectedCategoria === 'null' || this.selectedDivision === 'null' || this.selectedGenero === 'null') {
    //   this.showErrorMessages('Debe completar todos los filtros');
    //   return;
    // }
    this.loading = true;
    this.scrappingService.getGoleadoresHistoricosPorCategoria(
      this.selectedCategoria,
      this.selectedDivision,
      this.selectedGenero
    ).subscribe({
      next: (res: any) => {
        this.goleadores = res.map((goleador: any, index: number) => {
          return {
            _id: goleador.jugador_id,
            goles: goleador.goles,
            posicion: index + 1,
            nombre: goleador.jugador_nombre,
            equipo: goleador.equipo_nombre,
            categoria: goleador.jugador_categoria,
            division: goleador.jugador_division,
            cantPartidos: goleador.partidosJugados,
            promedioGoles: (goleador.goles / goleador.partidosJugados).toFixed(2)
          };
        });
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  filtrarPorEquipo() {
    // if (
    //   this.selectedEquipo === 'null' ||
    //   this.selectedCategoria === 'null' ||
    //   this.selectedDivision === 'null' ||
    //   this.selectedGenero === 'null'
    // ) {
    //   this.showErrorMessages('Debe completar todos los filtros');
    //   return;
    // }
    this.loading = true;
    this.scrappingService.getGoleadoresHistoricosPorEquipo(
      this.selectedEquipo,
      this.selectedCategoria,
      this.selectedDivision,
      this.selectedGenero
    ).subscribe({
      next: (res: any) => {
        this.goleadores = res.map((goleador: any, index: number) => {
          return {
            _id: goleador.jugador_id,
            goles: goleador.goles,
            posicion: index + 1,
            nombre: goleador.jugador_nombre,
            equipo: goleador.equipo_nombre,
            categoria: goleador.jugador_categoria,
            division: goleador.jugador_division,
            cantPartidos: goleador.partidosJugados,
            promedioGoles: (goleador.goles / goleador.partidosJugados).toFixed(2)
          };
        });
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  showErrorMessages(mensaje: string) {
    this.messages = [];
    this.messages.push({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 });
  }

}
