import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TarefaModel } from '../Models/tarefa-model';
import { ParametroTarefa01 } from '../parametros/parametro-tarefa01';

@Injectable({
  providedIn: 'root',
})
export class TarefasService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getTarefas(): Observable<TarefaModel[]> {
    return this.http.get<TarefaModel[]>(`${this.apiURL}tarefas`);
  }

  getTarefas_01(params: ParametroTarefa01): Observable<TarefaModel[]> {
    return this.http.post<TarefaModel[]>(`${this.apiURL}tarefas`, params);
  }

  getTarefa(id_empresa: number, codigo: string): Observable<TarefaModel> {
    return this.http.get<TarefaModel>(`/api/tarefa/${id_empresa}/${codigo}`);
  }

  TarefaInsert(tarefa: any) {
    return this.http.post<TarefaModel>(`${this.apiURL}tarefa/`, tarefa);
  }

  TarefaUpdate(tarefa: TarefaModel) {
    return this.http.put<TarefaModel>(`${this.apiURL}tarefa/`, tarefa);
  }

  TarefaDelete(id_empresa: number, codigo: string) {
    return this.http.delete<TarefaModel>(`/api/tarefa/${id_empresa}/${codigo}`);
  }
}
