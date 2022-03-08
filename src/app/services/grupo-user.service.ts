import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GruUserModel } from '../Models/gru-user-model';
import { ParametroGruuser01 } from '../parametros/parametro-gruuser-01';

@Injectable({
  providedIn: 'root',
})
export class GrupoUserService {
  constructor(private http: HttpClient) {}

  getGrupoUsers(): Observable<GruUserModel[]> {
    return this.http.get<GruUserModel[]>('/api/gruusers');
  }

  getGrupoUsers_01(params: ParametroGruuser01): Observable<GruUserModel[]> {
    return this.http.post<GruUserModel[]>('/api/gruusers', params);
  }

  getGrupoUser(id_empresa: number, id: number) {
    return this.http.get<GruUserModel>(`/api/gruuser/${id_empresa}/${id}`);
  }

  GrupoUserInsert(grupo: any) {
    return this.http.post<GruUserModel>('/api/gruuser/', grupo);
  }

  GrupoUserUpdate(grupo: GruUserModel) {
    return this.http.put<GruUserModel>('/api/gruuser/', grupo);
  }

  GrupoUserDelete(id_empresa: number, id: number) {
    return this.http.delete<GruUserModel>(`/api/gruuser/${id_empresa}/${id}`);
  }
}
