import { GrupoEcoModel } from './../Models/gru-eco-models';
import { ParametroGrupoEco01 } from './../parametros/parametro-grupo-eco01';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GrupoEconomicoService {
  constructor(private http: HttpClient) {}

  getGrupoEcos(): Observable<GrupoEcoModel[]> {
    return this.http.get<GrupoEcoModel[]>('/api/gruecos');
  }

  getGrupoEcos_01(params: ParametroGrupoEco01): Observable<GrupoEcoModel[]> {
    return this.http.post<GrupoEcoModel[]>('/api/gruecos', params);
  }

  getGrupoEco(id_empresa: number, id: number): Observable<GrupoEcoModel> {
    return this.http.get<GrupoEcoModel>(`/api/grueco/${id_empresa}/${id}`);
  }

  GrupoEcoInsert(grupo: any) {
    return this.http.post<GrupoEcoModel>('/api/grueco/', grupo);
  }

  GrupoEcoUpdate(grupo: GrupoEcoModel) {
    return this.http.put<GrupoEcoModel>('/api/grueco/', grupo);
  }

  GrupoEcoDelete(id_empresa: number, id: number) {
    return this.http.delete<GrupoEcoModel>(`/api/grueco/${id_empresa}/${id}`);
  }
}
