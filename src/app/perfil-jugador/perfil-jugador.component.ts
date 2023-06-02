import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ScrappingService } from '../services/scrapping.service';

@Component({
  selector: 'app-perfil-jugador',
  templateUrl: './perfil-jugador.component.html',
  styleUrls: ['./perfil-jugador.component.scss'],
  providers: [ ScrappingService]
})
export class PerfilJugadorComponent implements OnInit, OnChanges {

  @Input () jugador: any;
  @Output() jugadorEliminado = new EventEmitter<void>();
  estadisticas: any[] = [];

  constructor(
    private scrappingService: ScrappingService
  ) { }

  ngOnInit(): void {
    // this.getEstadisticas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jugador']) {
      // Aquí, puedes reaccionar a los cambios en el jugador.
      // Por ejemplo, podrías llamar a getEstadisticas() nuevamente:
      this.getEstadisticas(changes['jugador'].currentValue._id);
    }
  }

  getEstadisticas(idJugador: string) {
    this.scrappingService.getEstadisticas(idJugador).subscribe({
      next: (res: any) => {
        let arr = Object.entries(res.estadisticasXFecha).map(([key, value]) => {
          let stats = value as {goles: number, amarillas: number, rojas: number, dosmin: number, azules: number};
          return {
            fecha: key,
            goles: stats.goles,
            amarillas: stats.amarillas,
            rojas: stats.rojas,
            dosmin: stats.dosmin,
            azules: stats.azules,
          };
        });


        // let arr = Object.values(res.estadisticasXFecha);
        this.estadisticas = arr
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }

  goBack(){
    this.jugador = null;
    this.jugadorEliminado.emit();
  }

}
