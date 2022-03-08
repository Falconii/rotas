import { CadastroAcoes } from './../shared/cadastro-acoes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditorModel } from '../Models/auditor-model';

@Injectable({
  providedIn: 'root'
})
export class AuditoresService {

  constructor(private http:HttpClient) { }


  getAuditores():Observable<AuditorModel[]>{

    return this.http.get<AuditorModel[]>('http://localhost:3052/auditores');

  }

  getAuditor(id:number):Observable<AuditorModel[]>{
    let url:string = "http://localhost:3052/auditores?id=" + id.toString() ;
    return this.http.get<AuditorModel[]>(url);
  }

  executaAcao(auditor:any,opcao:number){
        console.log("Gravando",auditor);
        console.log("Opção: ",opcao);
        switch (+opcao) {
          case CadastroAcoes.Inclusao:
            this.gravar(auditor);
            break;
          case CadastroAcoes.Edicao:
            this.alterar(auditor);
            break;
           case CadastroAcoes.Exclusao:
            this.excluir(auditor.id);
            break;
          default:
            break;
        }
        //this.gravar(auditor);
  }

  gravar(auditor:AuditorModel){
    this.http.post('http://localhost:3052/AUDITORES',auditor)
    .subscribe(dados => {
      console.log("Retorno");
      console.log(dados);
    },
      (error:any) => {
        console.log(error.headers);
        alert("Falha na gravação");}
      );
  }

  alterar(auditor:AuditorModel){
    let url:string = "http://localhost:3052/auditores/" + auditor.id;
    this.http.put(url ,auditor)
    .subscribe(dados => {
      console.log("Retorno");
      console.log(dados);
    },
      (error:any) => {
        console.log(error.headers);
        alert("Falha na gravação");}
      );

  }

  excluir(id:number){
    let url:string = "http://localhost:3052/auditores/" + id.toString() ;
    this.http.delete(url)
    .subscribe(dados => {
      console.log("Retorno - Excluir");
      console.log(dados);
    },
      (error:any) => {
        console.log(error.headers);
        alert("Falha na exclusão");}
      );

  }
}
