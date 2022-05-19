import { CondicaoService } from './../../../services/condicao.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CondicoesPagtoModel } from 'src/app/Models/condicoes_pagtoModel';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';

@Component({
  selector: 'app-condicao-view',
  templateUrl: './condicao-view.component.html',
  styleUrls: ['./condicao-view.component.css'],
})
export class CondicaoViewComponent implements OnInit {
  formulario: FormGroup;

  condicao: CondicoesPagtoModel = new CondicoesPagtoModel();

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetGrupo!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;

  durationInSeconds = 2;

  labelCadastro: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private condicaoService: CondicaoService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      descricao: [{ value: '' }, [ValidatorStringLen(3, 50, true)]],
      np: [{ value: '' }, [Validators.min(0), Validators.max(24)]],
      parcelas: [{ value: '' }, [ValidatorStringLen(3, 72, false)]],
      dia: [{ value: '' }, [Validators.min(0), Validators.max(28)]],
    });
    this.condicao = new CondicoesPagtoModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.condicao.id_empresa = params.id_empresa;
      this.condicao.id = params.id;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
  }

  ngOnInit(): void {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      this.condicao = new CondicoesPagtoModel();
      this.condicao.id_empresa = 1;
    } else {
      this.getCondicao();
    }

    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGetGrupo?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
    }
  }

  setValue() {
    this.formulario.setValue({
      id: this.condicao.id,
      descricao: this.condicao.descricao,
      np: this.condicao.np,
      parcelas: this.condicao.parcelas,
      dia: this.condicao.dia,
    });
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  onCancel() {
    this.router.navigate(['/condicoes']);
  }

  getCondicao() {
    this.inscricaoGetGrupo = this.condicaoService
      .getCondicao(this.condicao.id_empresa, this.condicao.id)
      .subscribe(
        (data: CondicoesPagtoModel) => {
          this.condicao = data;
          this.setValue();
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa Nos Condições De Pagamento ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Condições De Pagamento - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Condições De Pagamento - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Condições De Pagamento - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Condições De Pagamento - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.condicao.descricao = this.formulario.value.descricao;
    this.condicao.np = this.formulario.value.np;
    this.condicao.parcelas = this.formulario.value.parcelas;
    this.condicao.dia = this.formulario.value.dia;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.condicaoService
          .CondicaoInsert(this.condicao)
          .subscribe(
            async (data: CondicoesPagtoModel) => {
              this.onCancel();
            },
            (error: any) => {
              this.openSnackBar_Err(
                `Erro Na INclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.inscricaoAcao = this.condicaoService
          .CondicaoUpdate(this.condicao)
          .subscribe(
            async (data: any) => {
              this.onCancel();
            },
            (error: any) => {
              console.log('Error', error.error);
              this.openSnackBar_Err(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.inscricaoAcao = this.condicaoService
          .CondicaoDelete(this.condicao.id_empresa, this.condicao.id)
          .subscribe(
            async (data: any) => {
              this.onCancel();
            },
            (error: any) => {
              this.openSnackBar_Err(
                `Erro Na Exclusao ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      default:
        break;
    }
  }

  openSnackBar_Err(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  async openSnackBar_OK(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
    await this.delay(this.durationInSeconds * 1000);
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getAcoes() {
    return CadastroAcoes;
  }

  touchedOrDirty(campo: string): boolean {
    if (
      this.formulario.get(campo)?.touched ||
      this.formulario.get(campo)?.dirty
    ) {
      return true;
    }
    return false;
  }

  getValidfield(field: string): boolean {
    return (
      this.formulario.get(field)?.errors?.ValidatorStringLen &&
      this.touchedOrDirty(field)
    );
  }

  getMensafield(field: string): string {
    return this.formulario.get(field)?.errors?.message;
  }
}
