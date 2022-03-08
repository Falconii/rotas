import { UsuarioQuery01Model } from './../Models/usuario-query_01-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../Models/usuario-model';
import { ParametroUsuario01 } from '../parametros/parametro-usuario-01';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>('/api/usuarios');
  }

  getUsuario(id_empresa: number, id: number): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`/api/usuario/${id_empresa}/${id}`);
  }

  getusuarios_01(
    params: ParametroUsuario01
  ): Observable<UsuarioQuery01Model[]> {
    return this.http.post<UsuarioQuery01Model[]>('/api/usuarios', params);
  }

  UsuarioInsert(usuario: any) {
    return this.http.post<UsuarioModel>('/api/usuario/', usuario);
  }

  UsuarioUpdate(usuario: UsuarioModel) {
    return this.http.put<UsuarioModel>('/api/usuario/', usuario);
  }

  UsuarioDelete(id_empresa: number, id: number) {
    return this.http.delete<UsuarioModel>(`/api/usuario/${id_empresa}/${id}`);
  }
}
