import { ParametroMotivoApo01 } from './../parametros/parametro-motivo-apo01';
import { MotivoApoModel } from './../Models/motivo-apo-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MotivoApoService {
  constructor(private http: HttpClient) {}

  getMotivoApos(): Observable<MotivoApoModel[]> {
    return this.http.get<MotivoApoModel[]>('/api/motivoapos');
  }

  getMotivoApos_01(params: ParametroMotivoApo01): Observable<MotivoApoModel[]> {
    return this.http.post<MotivoApoModel[]>('/api/motivoapos', params);
  }

  getMotivoApo(id_empresa: number, codigo: string) {
    return this.http.get<MotivoApoModel>(
      `/api/motivoapo/${id_empresa}/${codigo}`
    );
  }

  MotivoApoInsert(motivo: any) {
    return this.http.post<MotivoApoModel>('/api/motivoapo/', motivo);
  }

  MotivoApoUpdate(motivo: MotivoApoModel) {
    return this.http.put<MotivoApoModel>('/api/motivoapo/', motivo);
  }

  MotivoApoDelete(id_empresa: number, codigo: string) {
    return this.http.delete<MotivoApoModel>(
      `/api/motivoapo/${id_empresa}/${codigo}`
    );
  }
}
