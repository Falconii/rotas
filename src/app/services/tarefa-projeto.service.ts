import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TarefaProjetoModel } from '../Models/tarefa-projeto-model';
import { ParametroTarefaProjeto01 } from '../parametros/parametro-tarefa-projeto01';

@Injectable({
  providedIn: 'root',
})
export class TarefaProjetoService {
  constructor(private http: HttpClient) {}

  getTarefasProjetos(): Observable<TarefaProjetoModel[]> {
    return this.http.get<TarefaProjetoModel[]>('/api/tarefasprojetos');
  }

  getTarefasProjetos_01(
    params: ParametroTarefaProjeto01
  ): Observable<TarefaProjetoModel[]> {
    return this.http.post<TarefaProjetoModel[]>('/api/tarefasprojetos', params);
  }

  getTarefaProjeto(
    id_empresa: number,
    id: number
  ): Observable<TarefaProjetoModel> {
    return this.http.get<TarefaProjetoModel>(
      `/api/tarefaprojeto/${id_empresa}/${id}`
    );
  }

  TarefaProjetoInsert(tarefa: any) {
    return this.http.post<TarefaProjetoModel>('/api/tarefaprojeto/', tarefa);
  }

  TarefaProjetoUpdate(tarefa: TarefaProjetoModel) {
    return this.http.put<TarefaProjetoModel>('/api/tarefaprojeto/', tarefa);
  }

  TarefaProjetoDelete(id_empresa: number, id: number) {
    return this.http.delete<TarefaProjetoModel>(
      `/api/tarefaprojeto/${id_empresa}/${id}`
    );
  }
}
