import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { ScrappingService } from '../services/scrapping.service';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Torneo } from '../main/header/header.component';
import * as moment from 'moment';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  providers: [MessageService, ScrappingService]
})
export class StatisticsComponent implements OnInit {

  dataGrafico: any;
  options: any;

  dataGraficoBajoPromedio: any;
  dataGraficoSobrePromedio: any;
  optionsMVP: any;

  loading: boolean = false;
  torneos: Torneo[] = [];
  torneo: Torneo = {
    year: 2023,
    tipo: 'APERTURA',
  }
  fechaActualizacion: string = '';

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
  estadisticas: any[] = [
    { label: 'Elegir Estadística...', value: 'null' },
    { label: 'Impacto del medio tiempo', value: 'primerTiempo' },
    { label: 'Impacto del goleador', value: 'segunGoleador' },
    { label: '% vic. Visitante/Local', value: 'porcentajeVisitanteLocal' },
  ];

  selectedDivision: any = this.divisionesMayores[0].value;
  selectedCategoria: any = this.categorias[0].value;
  selectedGenero: any = this.generos[0].value;
  selectedEquipo: any;
  selectedEstadistica: any = this.estadisticas[0].value;

  mostrarEquipos: boolean = true;

  equipoFiltrado: any;
  goleador: any;
  arrayPartidosMVP: any[] = [];

  arrayPartidosVisitante: any[] = [];

  arrayPartidos: any[] = [];

  messages: Message[] = [];
  mensajeExplicativo: string = 'Selecciona una estadística para obtener una breve explicacion.'
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

  onFilterChange(event: any) {
    console.log(event);
    this.mostrarEquipos = event === 'porcentajeVisitanteLocal' ? false : true;
    if(event == 'primerTiempo'){
      this.mensajeExplicativo = 'Explora cómo el resultado al medio tiempo afecta el desenlace del partido.';
    }
    else if(event == 'segunGoleador'){
      this.mensajeExplicativo = 'Analiza cómo la actuación de los máximos anotadores influye en el resultado final del partido.';
    }
    else if(event == 'porcentajeVisitanteLocal'){
      this.mensajeExplicativo = 'La tabla muestra el porcentaje de partidos ganados como local y visitante.';
    }
    else{
      this.mensajeExplicativo = 'Selecciona una estadística para obtener una breve explicacion.';
    }
  }

  showErrorMessages(mensaje: string) {
    this.messages = [];
    this.messages.push({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 });
  }

  ngOnInit(): void {
    this.getEquipos();
    this.scrappingService.getUltimaActualizacion().subscribe( res => {
      const date = new Date(res.ultima_actualizacion);
      this.fechaActualizacion = moment(date).format('DD/MM/YYYY - HH:mm:ss');
    });
    this.getTorneos();
  }

  private updateTorneoFromRoute() {
    const year = this.route.snapshot.paramMap.get('year');
    const tipo = this.route.snapshot.paramMap.get('tipo');
    this.torneo.year = parseInt(year || '2023');
    this.torneo.tipo = tipo || 'APERTURA';
  }

  async getEquipos() {
    this.loading = true;
    await this.scrappingService.getEquipos().subscribe({
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
          this.loading = false;
      },
      complete: () => {
        console.log('complete');
        this.loading = false;
      }
    });
  }

  async getTorneos() {
    this.loading = true;
    await this.scrappingService.getTorneos().subscribe({
      next: (res: any) => {
        this.torneos = res.map((torneo: any) => {
          return {
            label: `${torneo.tipo} ${torneo.year}`,
            value: torneo
            };
          });

      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        console.log('complete');
      }
    });
  }
  generarGrafico(){
    this.cleanEverything();
    if( (this.selectedEstadistica === 'porcentajeVisitanteLocal' &&
        (this.selectedCategoria === 'null' ||
        this.selectedDivision === 'null' ||
        this.selectedGenero === 'null'))
        ||
        (this.selectedEstadistica !== 'porcentajeVisitanteLocal' &&
        (this.selectedEquipo === '65a27b1519a5e5c6e8d56802' ||
        this.selectedEstadistica === 'null' ||
        this.selectedCategoria === 'null' ||
        this.selectedDivision === 'null' ||
        this.selectedGenero === 'null'))
    ){
      this.showErrorMessages('Debe completar todos los filtros');
      return;
    }
    console.log(this.selectedEquipo);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    if(this.selectedEstadistica === 'primerTiempo'){
      this.generarGraficoSegun1erTiempo(textColor, textColorSecondary, surfaceBorder);
    } else if(this.selectedEstadistica === 'segunGoleador'){
      this.generarGraficoSegunMVP(textColor, textColorSecondary, surfaceBorder);
    } else if(this.selectedEstadistica === 'porcentajeVisitanteLocal'){
      this.generarTablaPorcentajeVisitanteLocal();
    }
    else{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Debe seleccionar una estadística'});
    }

  }

  generarGraficoSegun1erTiempo(textColor: string, textColorSecondary: string, surfaceBorder: string){
    this.loading = true;
    this.cleanEverything();
    this.scrappingService.getEstadisticasByEquipo(this.selectedEquipo, this.selectedCategoria, this.selectedDivision, this.selectedGenero, this.torneo).subscribe({
      next: (res: any) => {
        console.log(res);
        this.dataGrafico = this.transformarDatosParaGraficoStacked(res.resultados);
        this.arrayPartidos = res.arrayPartidos.sort((a: any, b: any) => {
          // Convertir las fechas a objetos Date para poder compararlas
          let fechaA = a.partido.fecha
          let fechaB = b.partido.fecha

          // Comparar las fechas
          return fechaA - fechaB;
      });

        this.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          responsive: true,
          plugins: {
              tooltips: {
                  mode: 'index',
                  intersect: false
              },
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  stacked: true,
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              y: {
                  stacked: true,
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        console.log('complete');
      }
    });
  }

  // TODO: agregar como parametro el primer y segundo tiempo. Tipo que pasa cuando juega un mail primer tiempo por ejemplo.
  async generarGraficoSegunMVP(textColor: string, textColorSecondary: string, surfaceBorder: string){
    this.loading = true;
    this.dataGraficoBajoPromedio = null;
    this.dataGraficoSobrePromedio = null;
    this.equipoFiltrado = null;
    this.goleador = null;
    this.optionsMVP = null;
    this.arrayPartidosMVP = [];
    this.cleanEverything();
    this.equipoFiltrado = await this.getEquipoById(this.selectedEquipo)
    await this.scrappingService.getEstadisticasSegunMVP(this.selectedEquipo, this.selectedCategoria, this.selectedDivision, this.selectedGenero, this.torneo).subscribe({
        next: (res: any) => {
            console.log(res);

            // Transformar datos para el gráfico de MVP bajo el promedio
            this.dataGraficoBajoPromedio = this.transformarDatosParaGraficoPie(res.bajoPromedio);
            // Transformar datos para el gráfico de MVP sobre el promedio
            this.dataGraficoSobrePromedio = this.transformarDatosParaGraficoPie(res.sobrePromedio);

            // Obtener el goleador del equipo
            this.goleador = res.jugador;

            // Obtener los partidos del MVP
            this.arrayPartidosMVP = res.arrayPartidos.sort((a: any, b: any) => {
                // Convertir las fechas a objetos Date para poder compararlas
                let fechaA = a.fecha
                let fechaB = b.fecha
                ;
                // Comparar las fechas
                return fechaA - fechaB;
            }
            );
            this.arrayPartidosMVP.unshift({
                fecha: 'Resumen/Promedio',
                equipoRival: { nombre: '' },
                resultado: '',
                golesMVP: `${res.totalGoles} / ${res.promedioGolesMVP}`,
                porcentajeGolesMVP: res.porcentajeGolesMVP,
            });

            // Opciones comunes para ambos gráficos
            this.options = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                responsive: true,
                plugins: {
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                }
            };
        },
        error: (error) => {
            console.log(error);
            this.loading = false;
        },
        complete: () => {
            this.loading = false;
            console.log('complete');
        }
    });
}

getEquipoById(idEquipo: string) {
  return new Promise(async (resolve, reject) => {
      (await this.scrappingService.getEquipoById(idEquipo)).subscribe({
          next: (res: any) => {
              resolve(res.nombre);
          },
          error: (error) => {
              reject(error);
          }
      });
  }
  );
}
transformarDatosParaGraficoPie(datosMVP: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    return {
        labels: ['Ganados', 'Perdidos', 'Empatados'],
        datasets: [
            {
                data: [
                    parseFloat(datosMVP.porcentajeGanados),
                    parseFloat(datosMVP.porcentajePerdidos),
                    parseFloat(datosMVP.porcentajeEmpatados)
                ],
                backgroundColor: [
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--yellow-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--green-400'),
                    documentStyle.getPropertyValue('--red-400'),
                    documentStyle.getPropertyValue('--yellow-400')
                ]
            }
        ]
    };
}

  transformarDatosParaGraficoStacked(respuestaApi: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    return {
        labels: ['Ganar Primer Tiempo', 'Empatar Primer Tiempo', 'Perder Primer Tiempo'],
        datasets: [
            {
                type: 'bar',
                label: 'Y Ganar',
                backgroundColor: documentStyle.getPropertyValue('--green-500'), // Azul
                data: [
                    respuestaApi.ganarPrimerTiempoYGanar,
                    respuestaApi.empatarPrimerTiempoYGanar,
                    respuestaApi.perderPrimerTiempoYGanar
                ]
            },
            {
                type: 'bar',
                label: 'Y Empatar',
                backgroundColor: documentStyle.getPropertyValue('--yellow-500'), // Amarillo
                data: [
                    respuestaApi.ganarPrimerTiempoYEmpatar,
                    respuestaApi.empatarPrimerTiempoYEmpatar,
                    respuestaApi.perderPrimerTiempoYEmpatar
                ]
            },
            {
                type: 'bar',
                label: 'Y Perder',
                backgroundColor: documentStyle.getPropertyValue('--red-500'),
                data: [
                    respuestaApi.ganarPrimerTiempoYPerder,
                    respuestaApi.empatarPrimerTiempoYPerder,
                    respuestaApi.perderPrimerTiempoYPerder
                ]
            }
        ]
    };
}

  generarTablaPorcentajeVisitanteLocal(){
    this.loading = true;
    this.cleanEverything();
    this.scrappingService.getPorcentajeVisitanteLocal(this.selectedCategoria, this.selectedDivision, this.selectedGenero, this.torneo).subscribe({
      next: (res: any) => {

        console.log(res);
        this.arrayPartidosVisitante = res

        this.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          responsive: true,
          plugins: {
              tooltips: {
                  mode: 'index',
                  intersect: false
              },
              legend: {
                  labels: {
                      color: 'white'
                  }
              }
          },
          scales: {
              x: {
                  stacked: true,
                  ticks: {
                      color: 'white'
                  },
                  grid: {
                      color: 'white',
                      drawBorder: false
                  }
              },
              y: {
                  stacked: true,
                  ticks: {
                      color: 'white'
                  },
                  grid: {
                      color: 'white',
                      drawBorder: false
                  }
              }
          }
      };
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        console.log('complete');
      }
    });
  }

  cleanEverything(){
    this.dataGrafico = null;
    this.dataGraficoBajoPromedio = null;
    this.dataGraficoSobrePromedio = null;
    this.optionsMVP = null;
    this.equipoFiltrado = null;
    this.goleador = null;
    this.arrayPartidosMVP = [];
    this.arrayPartidosVisitante = [];
    this.arrayPartidos = [];
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    console.log('resize');
    this.reRenderizarGrafico();
  }
  reRenderizarGrafico() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    // Aquí puedes actualizar tus gráficos con nuevas dimensiones si es necesario
    // Puede ser tan simple como reasignar tus opciones de gráfico para forzar la actualización
    if(this.dataGrafico){

      // this.transformarDatosParaGraficoPie(this.dataGrafico);
      this.dataGrafico = {  ...this.dataGrafico };
    } else if(this.dataGraficoBajoPromedio && this.dataGraficoSobrePromedio){

      this.dataGraficoBajoPromedio = {  ...this.dataGraficoBajoPromedio };
      this.dataGraficoSobrePromedio = {  ...this.dataGraficoSobrePromedio };
      // this.transformarDatosParaGraficoPie(this.dataGraficoBajoPromedio);
      // this.transformarDatosParaGraficoPie(this.dataGraficoSobrePromedio);
    }
  }

}
