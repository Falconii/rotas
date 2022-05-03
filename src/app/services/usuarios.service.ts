import { UsuarioModel } from 'src/app/Models/usuario-model';
import { UsuarioQuery01Model } from './../Models/usuario-query_01-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametroUsuario01 } from '../parametros/parametro-usuario-01';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  static login: UsuarioModel = new UsuarioModel();

  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiURL}usuarios`);
  }

  getUsuario(id_empresa: number, id: number): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(
      `${this.apiURL}usuario/${id_empresa}/${id}`
    );
  }

  getusuarios_01(
    params: ParametroUsuario01
  ): Observable<UsuarioQuery01Model[]> {
    return this.http.post<UsuarioQuery01Model[]>(
      `${this.apiURL}usuarios`,
      params
    );
  }

  UsuarioInsert(usuario: any) {
    return this.http.post<UsuarioModel>(`${this.apiURL}usuario/`, usuario);
  }

  UsuarioUpdate(usuario: UsuarioModel) {
    return this.http.put<UsuarioModel>(`${this.apiURL}usuario/`, usuario);
  }

  UsuarioDelete(id_empresa: number, id: number) {
    return this.http.delete<UsuarioModel>(`/api/usuario/${id_empresa}/${id}`);
  }

  setarUsuario(user: UsuarioModel) {
    UsuariosService.login = user;
  }
}
