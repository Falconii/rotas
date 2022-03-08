import { ParametroProjeto01 } from './../parametros/parametro-projeto01';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjetoModel } from '../Models/projeto-model';

@Injectable({
  providedIn: 'root',
})
export class ProjetosService {
  constructor(private http: HttpClient) {}

  getProjetos(): Observable<ProjetoModel[]> {
    return this.http.get<ProjetoModel[]>('/api/projetos');
  }

  getProjetos_01(params: ParametroProjeto01): Observable<ProjetoModel[]> {
    return this.http.post<ProjetoModel[]>('/api/projetos', params);
  }

  getProjeto(id_empresa: number, id: number) {
    return this.http.get<ProjetoModel>(`/api/projeto/${id_empresa}/${id}`);
  }

  ProjetoInsert(projeto: any) {
    return this.http.post<ProjetoModel>('/api/projeto/', projeto);
  }

  ProjetoUpdate(projeto: ProjetoModel) {
    return this.http.put<ProjetoModel>('/api/projeto/', projeto);
  }

  ProjetoDelete(id_empresa: number, id: number) {
    return this.http.delete<ProjetoModel>(`/api/projeto/${id_empresa}/${id}`);
  }
}
