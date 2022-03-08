import { EstadoModel } from './../Models/estado-model';
import { DropdownService } from './../shared/services/dropdown.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuditoresService } from './../services/auditores.service';
import { AuditorModel } from './../Models/auditor-model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CadastroAcoes } from '../shared/cadastro-acoes';

@Component({
  selector: 'app-crud-auditor',
  templateUrl: './crud-auditor.component.html',
  styleUrls: ['./crud-auditor.component.css']
})
export class CrudAuditorComponent implements OnInit {

  auditores:AuditorModel[]  = [];

  inscricao?:Subscription;

  erro:string = "";

  tabela:string = "Auditores";

  parametros:FormGroup;

  opcoes: string[] = ['ID', 'Razão Social', 'CNPJ/CFP'];

  constructor(private auditoresServices:AuditoresService,
              private dropService:DropdownService,
              private router:Router,
              private formBuilder:FormBuilder) {
                this.parametros = formBuilder.group({
                  seletor:[null],
                  pesquisa:[null]
                });
                this.setValues();
               }

  ngOnInit() {
    this.getter();
  }

  ngOnDestroy() {
    this.inscricao?.unsubscribe();
  }
  getter(){
    this.inscricao = this.auditoresServices.getAuditores().subscribe(
      (data:AuditorModel[]) => {
            this.auditores = data;
      },
      (error:any) => {
         this.erro = error;
      }
    );
  }

  escolha(auditor:AuditorModel,opcao:number){
      console.log("Saindo Do CRUD-AUDITOR ",opcao);
      this.router.navigate(["/auditor",auditor.id,opcao])
  }

  setValues() {
    this.parametros.setValue({
      seletor: "ID",
      pesquisa: ""
    });
  }


 getAcoes(){
  return CadastroAcoes;
}
onBeforeUnload(){
  console.log("Passei Pela Confirmação Crud-Auditor");
}
}
