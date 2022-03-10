import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApoPlanejamentoMoldel } from '../Models/apo-planejamento-moldel';
import { ParametroAgendaPlanejamento01 } from '../parametros/parametro-agenda-planejamento01';
import { ParametroAgendaPlanejamento02 } from '../parametros/parametro-agenda-planejamento02';

@Injectable({
  providedIn: 'root',
})
export class AponPlanejamentoService {
  constructor(private http: HttpClient) {}

  apiURL: string = environment.apiURL;

  getApoPlanejamentos(): Observable<ApoPlanejamentoMoldel[]> {
    return this.http.get<ApoPlanejamentoMoldel[]>(`${this.apiURL}aponplans`);
  }

  getApoPlanejamentos_01(
    params: ParametroAgendaPlanejamento01
  ): Observable<ApoPlanejamentoMoldel[]> {
    return this.http.post<ApoPlanejamentoMoldel[]>(
      `${this.apiURL}aponplans`,
      params
    );
  }

  getAponAgendaPlanejamentos(
    params: ParametroAgendaPlanejamento02
  ): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiURL}aponagenda`, params);
  }

  ApoPlanejamentoInsert(aponplanejamento: any) {
    return this.http.post<ApoPlanejamentoMoldel>(
      `${this.apiURL}aponagenda`,
      aponplanejamento
    );
  }

  ApoPlanejamentoUpdate(aponplanejamento: ApoPlanejamentoMoldel) {
    return this.http.put<ApoPlanejamentoMoldel>(
      `${this.apiURL}aponplan`,
      aponplanejamento
    );
  }

  ApoPlanejamentoDelete(id_empresa: number, id: number) {
    return this.http.delete<ApoPlanejamentoMoldel>(
      `${this.apiURL}aponplan/${id_empresa}/${id}`
    );
  }
}
