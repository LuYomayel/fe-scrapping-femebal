import { environment } from '../environments/environment';import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders , HttpRequest, HttpErrorResponse   } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {map} from 'rxjs/operators';

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

  constructor(private http: HttpClient) { }

  getTable() {
    const categoria = 'Mayores';
    const division = 'Liga de Honor Oro';
    const genero = 'Masculino';
    return this.http.get(this.apiUrl + `jugador/categoria/${division}/${categoria}/${genero}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getTableFairPlay() {
    const categoria = 'Mayores';
    const division = 'Liga de Honor Oro';
    const genero = 'Masculino';
    return this.http.get(this.apiUrl + `jugador/fairplay/${division}/${categoria}/${genero}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getTableByCategoria(categoria: string, division: string, genero: string) {
    return this.http.get(this.apiUrl + `jugador/categoria/${division}/${categoria}/${genero}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getTableFairPlayByCategoria(categoria: string, division: string, genero: string) {
    return this.http.get(this.apiUrl + `jugador/fairplay/${division}/${categoria}/${genero}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getTableByEquipo(equipo: string, division: string, genero: string, categoria: string) {
    return this.http.get(this.apiUrl + `jugador/equipo/${equipo}/${division}/${categoria}/${genero}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getTableFairPlayByEquipo(equipo: string, division: string = 'Liga de Honor Oro', genero: string = "Masculino", categoria: string = "Mayores") {
    console.log(equipo, division, genero, categoria)
    return this.http.get(this.apiUrl + `jugador/fairPlayXClub/${equipo}/${division}/${categoria}/${genero}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getTableByJugador(jugador: string) {
    return this.http.get(this.apiUrl + `jugador/nombre/${jugador}`).pipe(
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

  getEstadisticas(idJugador: string){
    return this.http.get(this.apiUrl + `jugador/estadisticasJugador/${idJugador}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
}
