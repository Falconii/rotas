import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransportadorasModel } from '../Models/transportadora-model';

@Injectable({
  providedIn: 'root'
})
export class TransportadorasService {

  constructor(private http:HttpClient) { }

  getTransportadoras():Observable<TransportadorasModel[]>{

     return this.http.get<TransportadorasModel[]>('http://localhost:3052/transportadoras');

  }
}
