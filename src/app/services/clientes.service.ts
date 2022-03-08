import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientesModel } from '../Models/cliente-model';
import { ClientesQuery01Model } from '../Models/cliente-query_01-model';
import { ParametroCliente01 } from '../parametros/parametro-cliente-01';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http:HttpClient) { }

  getClientes():Observable<ClientesModel[]>{

    return this.http.get<ClientesModel[]>('/api/clientes');

  }

  getClientes_01(params : ParametroCliente01):Observable<ClientesQuery01Model[]>{

    return this.http.post<ClientesQuery01Model[]>('/api/clientes',params);

  }

  getCliente(id_empresa : number, id : number){
    return this.http.get<ClientesModel>(`/api/cliente/${id_empresa}/${id}`);

  }

  clienteInsert(cliente:any){
    return this.http.post<ClientesModel>('/api/cliente/',cliente);
  }

  clienteUpdate(cliente:ClientesModel){
    return this.http.put<ClientesModel>('/api/cliente/',cliente);
  }

  clienteDelete(id_empresa:number,id:number){
    return this.http.delete<ClientesModel>(`/api/cliente/${id_empresa}/${id}`);
  }

}
