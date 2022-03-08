import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TarefaModel } from '../Models/tarefa-model';
import { ParametroTarefa01 } from '../parametros/parametro-tarefa01';

@Injectable({
  providedIn: 'root',
})
export class TarefasService {
  constructor(private http: HttpClient) {}

  getTarefas(): Observable<TarefaModel[]> {
    return this.http.get<TarefaModel[]>('/api/tarefas');
  }

  getTarefas_01(params: ParametroTarefa01): Observable<TarefaModel[]> {
    return this.http.post<TarefaModel[]>('/api/tarefas', params);
  }

  getTarefa(id_empresa: number, codigo: string): Observable<TarefaModel> {
    return this.http.get<TarefaModel>(`/api/tarefa/${id_empresa}/${codigo}`);
  }

  TarefaInsert(tarefa: any) {
    return this.http.post<TarefaModel>('/api/tarefa/', tarefa);
  }

  TarefaUpdate(tarefa: TarefaModel) {
    return this.http.put<TarefaModel>('/api/tarefa/', tarefa);
  }

  TarefaDelete(id_empresa: number, codigo: string) {
    return this.http.delete<TarefaModel>(`/api/tarefa/${id_empresa}/${codigo}`);
  }
}
