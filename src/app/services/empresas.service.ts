import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpresaModel } from '../Models/empresa-model';
import { EmpresaQuery01Model } from '../Models/empresa-query_01-model';
import { ParametroEmpresa01 } from '../parametros/parametro-empresa-01';

@Injectable({
  providedIn: 'root',
})
export class EmpresasService {
  constructor(private http: HttpClient) {}

  getEmpresas(): Observable<EmpresaQuery01Model[]> {
    return this.http.get<EmpresaQuery01Model[]>('/api/empresas');
  }

  getEmpresas_01(
    params: ParametroEmpresa01
  ): Observable<EmpresaQuery01Model[]> {
    return this.http.post<EmpresaQuery01Model[]>('/api/empresas', params);
  }

  getEmpresa(id: number) {
    return this.http.get<EmpresaModel>(`/api/empresa/${id}`);
  }

  EmpresaInsert(empresa: any) {
    return this.http.post<EmpresaModel>('/api/empresa/', empresa);
  }

  EmpresaUpdate(empresa: EmpresaModel) {
    return this.http.put<EmpresaModel>('/api/empresa/', empresa);
  }

  EmpresaDelete(id: number) {
    return this.http.delete<EmpresaModel>(`/api/empresa/${id}`);
  }
}
