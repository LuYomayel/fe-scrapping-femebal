import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrappingService } from '../services/scrapping.service';
import { Message, MessageService } from 'primeng/api';
import html2canvas from 'html2canvas';

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
        // this.goleadores = res.goleadores;
        this.goleadores = res.goleadores.map((goleador: any) => {
          return {
            nombre: goleador.nombre,
            promedioGoles: (goleador.goles / goleador.fechas.length).toFixed(2),
            goles: goleador.goles,
            fechas: goleador.fechas.length,
            equipo: goleador.equipo.nombre,
            categoria: goleador.categoria,
            division: goleador.division,
            cantPartidos: goleador.fechas.length,
          }
        })
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
        // this.goleadores = res.goleadores;
        this.goleadores = res.goleadores.map((goleador: any) => {
          return {
            nombre: goleador.nombre,
            promedioGoles: (goleador.goles / goleador.fechas.length).toFixed(2),
            goles: goleador.goles,
            fechas: goleador.fechas.length,
            equipo: goleador.equipo.nombre,
            categoria: goleador.categoria,
            division: goleador.division,
            cantPartidos: goleador.fechas.length,
          }
        })
        // console.log('goleadoresxd', goleadoresxd);
      }
      ,
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
        // this.goleadores = res.goleadores;
        this.goleadores = res.goleadores.map((goleador: any) => {
          return {
            nombre: goleador.nombre,
            promedioGoles: (goleador.goles / goleador.fechas.length).toFixed(2),
            goles: goleador.goles,
            fechas: goleador.fechas.length,
            equipo: goleador.equipo.nombre,
            categoria: goleador.categoria,
            division: goleador.division,
            cantPartidos: goleador.fechas.length,
          }
        })
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
        // this.goleadores = res.goleadores;
        this.goleadores = res.goleadores.map((goleador: any) => {
          return {
            nombre: goleador.nombre,
            promedioGoles: (goleador.goles / goleador.fechas.length).toFixed(2),
            goles: goleador.goles,
            fechas: goleador.fechas.length,
            equipo: goleador.equipo.nombre,
            categoria: goleador.categoria,
            division: goleador.division,
            cantPartidos: goleador.fechas.length,
          }
        })
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

  download() {
    const element = document.getElementById('pr_id_2-table');
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
      console.log('Goleadores: ', this.goleadores.length);
      // Guarda el contexto actual
      context.save();
      /*
      // Configurar el estilo de la marca de agua
      context.font = `${canvas.height * 0.10}px Arial`;
      context.fillStyle = 'rgba(0, 0, 0, 0.15)';  // Color negro con 15% de opacidad

      // Traduce el contexto al centro del canvas
      context.translate(canvas.width / 2, canvas.height / 2);

      // Rota el contexto
      context.rotate(-Math.PI / 4); // Rotar -45 grados

      // Obtiene el tamaño del texto
      const metrics = context.measureText('@LuYomayel');
      const textWidth = metrics.width;
      const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

      // Dibujar la marca de agua en el centro del canvas
      context.fillText('@LuYomayel', -textWidth / 2, textHeight / 2);
      */
      /*
      if(this.goleadores.length > 8){
        // Configurar el estilo de la marca de agua
        context.font = '100px Arial';
        context.fillStyle = 'rgba(0, 0, 0, 0.15)';  // Color negro con 15% de opacidad

        // Traduce el contexto al centro del canvas
        context.translate(canvas.width / 2, canvas.height / 2);
        // context.translate(200, 400);

        // Rota el contexto
        context.rotate(-Math.PI / 4); // Rotar -45 grados (0.785398 radianes)

        // Dibujar la marca de agua en el centro del canvas
        // context.fillText('@LuYomayel', 0, 0);
        context.fillText('@LuYomayel', -canvas.width / 2.3, -canvas.height / 5.5);

      }else if(this.goleadores.length > 5){
        context.font = '70px Arial';
        context.fillStyle = 'rgba(0, 0, 0, 0.15)';  // Color negro con 15% de opacidad

        // Traduce el contexto al centro del canvas
        context.translate(canvas.width / 2, canvas.height / 2);
        // context.translate(200, 400);

        // Rota el contexto
        context.rotate(-Math.PI / 4); // Rotar -45 grados (0.785398 radianes)

        // Dibujar la marca de agua en el centro del canvas
        // context.fillText('@LuYomayel', 0, 0);
        context.fillText('@LuYomayel', -canvas.width / 3.7, -canvas.height / 4.3);
      }else if(this.goleadores.length > 2){
        context.font = '50px Arial';
        context.fillStyle = 'rgba(0, 0, 0, 0.15)';  // Color negro con 15% de opacidad

        // Traduce el contexto al centro del canvas
        context.translate(canvas.width / 2, canvas.height / 2);
        // context.translate(200, 400);

        // Rota el contexto
        context.rotate(-Math.PI / 4); // Rotar -45 grados (0.785398 radianes)

        // Dibujar la marca de agua en el centro del canvas
        // context.fillText('@LuYomayel', 0, 0);
        context.fillText('@LuYomayel', -canvas.width / 3.7, -canvas.height / 4.3);
      }else{
        context.font = '30px Arial';
        context.fillStyle = 'rgba(0, 0, 0, 0.15)';  // Color negro con 15% de opacidad

        // Traduce el contexto al centro del canvas
        context.translate(canvas.width / 2, canvas.height / 2);
        // context.translate(200, 400);

        // Rota el contexto
        context.rotate(-Math.PI / 4); // Rotar -45 grados (0.785398 radianes)

        // Dibujar la marca de agua en el centro del canvas
        // context.fillText('@LuYomayel', 0, 0);
        context.fillText('@LuYomayel', -canvas.width / 3.7, -canvas.height / 4.3);
      }
      */

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





  showErrorMessages(mensaje: string) {
    this.messages = [];
    this.messages.push({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 });
  }
}
