import { DropdownService } from './../../shared/services/dropdown.service';
import { EstadoModel } from './../../Models/estado-model';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditorModel } from './../../Models/auditor-model';
import { AuditoresService } from './../../services/auditores.service';
import { Subscription, Subscriber } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, HostListener, OnInit } from '@angular/core';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { CrudValid } from 'src/app/shared/crud-valid';

@Component({
  selector: 'app-auditor-views',
  templateUrl: './auditor-views.component.html',
  styleUrls: ['./auditor-views.component.css']
})
export class AuditorViewsComponent implements OnInit {

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {console.log(Event)};
  inscricaoRota : Subscription;
  inscricaoAuditor? : Subscription;
  inscricaoUf? :Subscription;

  formulario : FormGroup;

  id:number = 0;

  erro:string = "";

  auditor:AuditorModel = new AuditorModel();
  estados:EstadoModel[] = [];

  acao:string = "Sem Definição";
  idAcao:number = CadastroAcoes.Inclusao;

  readOnly:boolean = false;

  constructor(private formBuilder:FormBuilder,
              private route:ActivatedRoute,
              private auditoresService:AuditoresService,
              private drop: DropdownService) {
            this.inscricaoRota = this.route.params.subscribe((params:any)=>{
            this.id = params.id;
            this.idAcao = params.acao;
            this.setAcao(params.acao);
      });
      this.formulario = this.formBuilder.group({
        id:[null],
        razao:[null,[Validators.required]],
        cnpj_cpf:[null,[Validators.required,Validators.minLength(11),Validators.maxLength(14),CrudValid.ValidaCpf]],
        cadastr:[null],
        end: this.formBuilder.group({
          endereco:[null,[Validators.required,]],
          bairro:[null,[Validators.required,]],
          cidade:[null,[Validators.required,]],
          uf:[null,Validators.required,],
          cep:[null,[Validators.required,CrudValid.validaCep]],

        }),
        tel:[null],
        email:[null],
        senha:[null,[Validators.required,Validators.minLength(8),Validators.maxLength(10),CrudValid.validaSenha]]
      });

  }

  ngOnInit() {
    if (this.acao == "Inclusão"){
      this.auditor = new AuditorModel();
    } else {
      this.getOne();
    }
  }

  ngOnDestroy() {
    this.inscricaoRota.unsubscribe();
    this.inscricaoAuditor?.unsubscribe();
    this.inscricaoUf?.unsubscribe();
  }


  getEstadosBR(){
    this.inscricaoUf = this.drop.getEstados().subscribe(
      (data:EstadoModel[]) => {
            this.estados = data;
            console.log(this.estados);
      },
      (error:any) => {
         this.erro = error;
      }
    );
  }

  getOne(){
    this.inscricaoAuditor = this.auditoresService.getAuditor(this.id).subscribe((data:AuditorModel[]) => {
      console.log(data);
      this.auditor = data[0];
      this.formulario.patchValue(this.auditor);
    },
    (error:any) => {
      this.erro = error;
      console.log("Erro No GetOne ",error)
    });
  }
  onSubmit(){

    console.log(this.formulario);

    //console.log("OLha o campo aí => ",this.formulario.get('senha')?.errors?.['passwordInvalid']);

    if (this.formulario.valid){

      this.auditoresService.executaAcao(this.formulario.value,this.idAcao);

    } else
    {
      console.log("Formulário Inválido!!");

      Object.keys(this.formulario.controls).forEach((campo) => {

        console.log("Nome do campo => ",campo);

        const controle = this.formulario.get(campo);

        console.log("Controle => ",controle);

      });

    }

    //

    //this.formulario.reset();

  }

  itsDisabled():boolean{
    return !this.formulario.valid;
 }

 setAcao(op:number){

   switch (+op) {
     case CadastroAcoes.Inclusao:
      this.acao = "Inclusão";
      this.readOnly = false;
       break;
     case CadastroAcoes.Edicao:
      this.acao = "Alteração";
      this.readOnly = false;
      break;
     case CadastroAcoes.Consulta:
      this.acao = "Voltar";
      this.readOnly = true;
       break;
     case CadastroAcoes.Exclusao:
      this.acao = "Exclusão";
      this.readOnly = true;
       break;
     default:
       break;
   }

 }

 confirmacao(){
   console.log("Passei Na Confirmação....");
 }

 onBuscaCep(){
   console.log("Entrei No Busca CEP");
 }

 touchedOrDirty(campo:string):boolean{

   if (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty ) return true;
   return false;

 }
}
