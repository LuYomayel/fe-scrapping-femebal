import { environment } from '../environments/environment';import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders , HttpRequest, HttpErrorResponse   } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {map} from 'rxjs/operators';
import { Torneo } from '../main/header/header.component';
@Injectable()
export class ScrappingService {
  protected apiUrl = environment.apiUrl;

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      // A client-side or network error occurred. Handle it accordingly.
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
        console.log(error);
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  constructor(private http: HttpClient) {
    console.log('scrapping service')
  }

  // Backend fixed
  getTable(torneo: Torneo) {
    const categoria = 'Mayores';
    const division = 'Liga de Honor Oro';
    const genero = 'Femenino';
    return this.http.get(this.apiUrl + `jugador/categoria/${division}/${categoria}/${genero}?tipo=${torneo.tipo}&year=${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }


  getTableFairPlay(torneo: Torneo) {
    const categoria = 'Mayores';
    const division = 'Liga de Honor Oro';
    const genero = 'Femenino';
    return this.http.get(this.apiUrl + `jugador/fairplay/${division}/${categoria}/${genero}?tipo=${torneo.tipo}&year=${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Backend fixed
  getTableByCategoria(categoria: string, division: string, genero: string, torneo: Torneo) {
    return this.http.get(this.apiUrl + `jugador/categoria/${division}/${categoria}/${genero}?tipo=${torneo.tipo}&year=${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }


  getTableFairPlayByCategoria(categoria: string, division: string, genero: string, torneo: Torneo) {
    return this.http.get(this.apiUrl + `jugador/fairplay/${division}/${categoria}/${genero}?tipo=${torneo.tipo}&year=${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Backend fixed
  getTableByEquipo(equipo: string, division: string, genero: string, categoria: string, torneo: Torneo) {
    return this.http.get(this.apiUrl + `jugador/equipo/${equipo}/${division}/${categoria}/${genero}?tipo=${torneo.tipo}&year=${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getTableFairPlayByEquipo(equipo: string, division: string = 'Liga de Honor Oro', genero: string = "Masculino", categoria: string = "Mayores", torneo: Torneo) {
    return this.http.get(this.apiUrl + `jugador/fairPlayXClub/${equipo}/${division}/${categoria}/${genero}?tipo=${torneo.tipo}&year=${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Backend fixed
  getTableByJugador(jugador: string, torneo: Torneo) {
    return this.http.get(this.apiUrl + `jugador/nombre/${jugador}?tipo=${torneo.tipo}&year=${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getEquipos() {
    return this.http.get(this.apiUrl + `equipo`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getEquipoById(idEquipo: string) {
    return this.http.get(this.apiUrl + `equipo/byId/${idEquipo}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  visitCount(){
    return this.http.get(this.apiUrl + `visitas`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getUltimaActualizacion(){
    return this.http.get(this.apiUrl + `visitas/ultimaActualizacion`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getEstadisticas(idJugador: string, torneo: Torneo){
    return this.http.get(this.apiUrl + `jugador/estadisticasJugador/${idJugador}?tipo=${torneo.tipo}&year=${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getTorneos(){
    console.log(this.apiUrl + `torneo`)
    return this.http.get(this.apiUrl + `torneo`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getEstadisticasByEquipo(idEquipo: string, categoria:string, division: string, genero:string, torneo: Torneo){
    console.log(this.apiUrl + `partido/estadisticas/${idEquipo}/${categoria}/${division}/${genero}/${torneo.tipo}/${torneo.year}`)
    return this.http.get(this.apiUrl + `partido/estadisticas/primer-tiempo/${idEquipo}/${categoria}/${division}/${genero}/${torneo.tipo}/${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getEstadisticasSegunMVP(idEquipo: string, categoria:string, division: string, genero:string, torneo: Torneo){
    return this.http.get(this.apiUrl + `partido/estadisticas/analizarRendimientoConMVP/${idEquipo}/${categoria}/${division}/${genero}/${torneo.tipo}/${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getPorcentajeVisitanteLocal(categoria:string, division: string, genero:string, torneo: Torneo){
    return this.http.get(this.apiUrl + `partido/estadisticas/visitanteLocal/${categoria}/${division}/${genero}/${torneo.tipo}/${torneo.year}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
}
