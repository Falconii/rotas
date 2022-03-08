import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrabalhoProjetoModel } from '../Models/trabalho-projeto-model';
import { ParametroTrabalhoProjeto01 } from '../parametros/parametro-trabalho-projeto01';

@Injectable({
  providedIn: 'root',
})
export class TrabalhoProjetoService {
  constructor(private http: HttpClient) {}

  getTrabalhosProjetos(): Observable<TrabalhoProjetoModel[]> {
    return this.http.get<TrabalhoProjetoModel[]>('/api/trabalhosprojetos');
  }

  getTrabalhosProjetos_01(
    params: ParametroTrabalhoProjeto01
  ): Observable<TrabalhoProjetoModel[]> {
    return this.http.post<TrabalhoProjetoModel[]>(
      '/api/trabalhosprojetos',
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
      '/api/trabalhosprojeto/',
      tarefa
    );
  }

  TrabalhoProjetoUpdate(tarefa: TrabalhoProjetoModel) {
    return this.http.put<TrabalhoProjetoModel>(
      '/api/trabalhosprojeto/',
      tarefa
    );
  }

  TrabalhoProjetoDelete(id_empresa: number, id: number) {
    return this.http.delete<TrabalhoProjetoModel>(
      `/api/trabalhosprojeto/${id_empresa}/${id}`
    );
  }
}
