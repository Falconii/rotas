import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AtividadeModel } from '../Models/atividade-model';
import { AtividadeQuery_01Model } from '../Models/atividade-query_01-model';
import { ParametroAtividade01 } from '../parametros/parametro-atividade01';

@Injectable({
  providedIn: 'root',
})
export class AtividadesService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getAtividades(): Observable<AtividadeModel[]> {
    return this.http.get<AtividadeModel[]>(`${this.apiURL}atividades`);
  }

  getAtividades_01(
    params: ParametroAtividade01
  ): Observable<AtividadeQuery_01Model[]> {
    return this.http.post<AtividadeQuery_01Model[]>(
      `${this.apiURL}atividades`,
      params
    );
  }

  getAtividade(id_empresa: number, id: number) {
    return this.http.get<AtividadeModel>(
      `${this.apiURL}atividade/${id_empresa}/${id}`
    );
  }

  atividadeInsert(atividade: any) {
    return this.http.post<AtividadeModel>(`${this.apiURL}atividade`, atividade);
  }

  atividadeUpdate(atividade: AtividadeModel) {
    return this.http.put<AtividadeModel>(`${this.apiURL}atividade`, atividade);
  }

  atividadeDelete(id_empresa: number, id: number) {
    return this.http.delete<AtividadeModel>(
      `${this.apiURL}atividade\${id_empresa}/${id}`
    );
  }

  anexaatividade(id_empresa: number, conta: string, id_projeto: number) {
    return this.http.get<any>(
      `${this.apiURL}anexaatividade/${id_empresa}/${conta}/${id_projeto}`
    );
  }

  desanexaatividade(id_empresa: number, conta: string, id_projeto: number) {
    return this.http.get<any>(
      `${this.apiURL}desanexaatividade/${id_empresa}/${conta}/${id_projeto}`
    );
  }
}
