import { Component, Renderer2 } from '@angular/core';
import { ScrappingService } from './services/scrapping.service';
import { ThemeService } from './services/theme.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ ScrappingService ]
})
export class AppComponent {
  title = 'fe-goleadores-femebal';

  constructor(
    private scrappingService: ScrappingService,
    private config: PrimeNGConfig
    ) { }

  ngOnInit(): void {
    // this.scrappingService.visitCount().subscribe( res => {
    //   // console.log(res);
    // });
    this.config.setTranslation({
      accept: 'Aceptar',
      reject: 'Cancelar',
      choose: 'Elegir',
      upload: 'Subir',
      cancel: 'Cancelar',
      dayNames: ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
      dayNamesShort: ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
      dayNamesMin: ["Do","Lu","Ma","Mi","Ju","Vi","Sá"],
      monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto",
      "Septiembre","Octubre","Noviembre","Diciembre"],
      monthNamesShort: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
      today: 'Hoy',
      weekHeader: 'Semana',
      firstDayOfWeek: 1,
      dateFormat: 'dd/mm/yy',
      weak: 'Débil',
      medium: 'Medio',
      strong: 'Fuerte',
      passwordPrompt: 'Ingrese una contraseña',
      emptyMessage: 'No hay registros',
      emptyFilterMessage: 'No hay resultados',
      startsWith: 'Comienza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Igual',
      notEquals: 'No igual',
      noFilter: 'Sin filtro',
      lt: 'Menor que',
      lte: 'Menor o igual que',
      gt: 'Mayor que',
      gte: 'Mayor o igual que',
      is: 'Es',
      isNot: 'No es',
      before: 'Antes',
      after: 'Después',
      clear: 'Limpiar',
      //translations
  });

  }


}
