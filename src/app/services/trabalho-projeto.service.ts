import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TrabalhoProjetoModel } from '../Models/trabalho-projeto-model';
import { ParametroTrabalhoProjeto01 } from '../parametros/parametro-trabalho-projeto01';

@Injectable({
  providedIn: 'root',
})
export class TrabalhoProjetoService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getTrabalhosProjetos(): Observable<TrabalhoProjetoModel[]> {
    return this.http.get<TrabalhoProjetoModel[]>(
      `${this.apiURL}trabalhosprojetos`
    );
  }

  getTrabalhosProjetos_01(
    params: ParametroTrabalhoProjeto01
  ): Observable<TrabalhoProjetoModel[]> {
    return this.http.post<TrabalhoProjetoModel[]>(
      `${this.apiURL}trabalhosprojetos`,
      params
    );
  }

  getTrabalhoProjeto(
    id_empresa: number,
    id: number
  ): Observable<TrabalhoProjetoModel> {
    return this.http.get<TrabalhoProjetoModel>(
      `/api/trabalhoprojeto/${id_empresa}/${id}`
    );
  }

  TrabalhoProjetoInsert(tarefa: any) {
    return this.http.post<TrabalhoProjetoModel>(
      `${this.apiURL}trabalhosprojeto/`,
      tarefa
    );
  }

  TrabalhoProjetoUpdate(tarefa: TrabalhoProjetoModel) {
    return this.http.put<TrabalhoProjetoModel>(
      `${this.apiURL}trabalhosprojeto/`,
      tarefa
    );
  }

  TrabalhoProjetoDelete(id_empresa: number, id: number) {
    return this.http.delete<TrabalhoProjetoModel>(
      `/api/trabalhosprojeto/${id_empresa}/${id}`
    );
  }
}
