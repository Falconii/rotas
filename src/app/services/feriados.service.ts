import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeriadoModel } from '../Models/feriado-model';

@Injectable({
  providedIn: 'root'
})

export class FeriadosService {

constructor(private http:HttpClient) { }


getFeriados():Observable<FeriadoModel[]>{

  return this.http.get<FeriadoModel[]>('http://localhost:3052/feriados');

}

getFeriado(codigo:string):Observable<FeriadoModel>{

  let url:string = "http://localhost:3052/feriados?datafer=" + codigo ;
  return this.http.get<FeriadoModel>(url);

}


}


