import { ParametroTarefa01 } from './../../parametros/parametro-tarefa01';
import { TarefasService } from './../../services/tarefas.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Subscriber } from 'rxjs';
import { TarefaModel } from 'src/app/Models/tarefa-model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { nextCode, MensagensBotoes } from 'src/app/shared/util';

@Component({
  selector: 'app-crud-trabalhos',
  templateUrl: './crud-trabalhos.component.html',
  styleUrls: ['./crud-trabalhos.component.css'],
})
export class CrudTrabalhosComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoRota!: Subscription;

  trabalhos: TarefaModel[] = [];

  trabalho: TarefaModel = new TarefaModel();

  formulario: FormGroup;

  erro: string = '';

  id_empresa = 0;

  codigo_tarefa = '';

  descricao_tarefa = '';

  durationInSeconds = 3;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  readOnlyKey: boolean = true;

  labelCadastro: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private trabalhosServices: TarefasService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      codigo: [{ value: '' }],
      descricao: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ],
      ],
    });
    this.trabalho = new TarefaModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.codigo_tarefa = params.tarefa;
      this.descricao_tarefa = params.descricao;
      this.idAcao = 99;
      this.setAcao(99);
    });
  }

  ngOnInit(): void {
    this.getTrabalhos();
  }

  ngOnDestroy(): void {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
  }

  getTrabalhos() {
    let par = new ParametroTarefa01();

    par.id_empresa = 1;

    par.codigo = this.codigo_tarefa;

    par.tarefa = 'N';

    par.trabalho = 'S';

    par.orderby = 'Código';

    this.inscricaoGetFiltro = this.trabalhosServices
      .getTarefas_01(par)
      .subscribe(
        (data: TarefaModel[]) => {
          this.trabalhos = data;
        },
        (error: any) => {
          if (error.error.message == 'Nehuma Informação Para Esta Consulta.') {
            let trab = new TarefaModel();
            trab.id_empresa = this.id_empresa;
            trab.codigo = '001';
            trab.user_insert = 1;
            this.trabalhos = [];
            this.trabalhos.push(trab);
            this.openSnackBar_OK(
              'Favor Cadastrar O Primeiro Trabalho OK',
              'OK'
            );
          } else {
            this.trabalhos = [];
            this.openSnackBar_Err(
              `Pesquisa Nas tarefas ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
        }
      );
  }

  escolha(trabalho: TarefaModel, opcao: number) {
    if (opcao == CadastroAcoes.Inclusao) {
      this.trabalho = new TarefaModel();
      this.trabalho.id_empresa = 1;
      if (trabalho.descricao == '') {
        this.trabalho.codigo = nextCode(this.codigo_tarefa);
      } else {
        this.trabalho.codigo = nextCode(
          this.trabalhos[this.trabalhos.length - 1].codigo
        );
        this.trabalho.user_insert = 1;
        this.trabalho.user_update = 0;
      }
    } else {
      this.trabalho = trabalho;
    }
    this.idAcao = opcao;
    this.setAcao(this.idAcao);
    this.setValue();
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Trabalho - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Trabalho - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Trabalho - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Trabalho - Exclusão.';
        this.readOnly = true;
        break;
      default:
        this.acao = '';
        this.labelCadastro = '';
        this.readOnly = true;
        break;
    }
  }

  executaAcao() {
    this.trabalho.descricao = this.formulario.value.descricao;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.trabalhosServices
          .TarefaInsert(this.trabalho)
          .subscribe(
            async (data: TarefaModel) => {
              await this.openSnackBar_OK(
                `Trabalho Cadastrado No Código: ${data.codigo}`,
                'OK'
              );
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
        this.inscricaoAcao = this.trabalhosServices
          .TarefaUpdate(this.trabalho)
          .subscribe(
            async (data: any) => {
              await this.openSnackBar_OK(data.message, 'OK');
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
        this.inscricaoAcao = this.trabalhosServices
          .TarefaDelete(this.trabalho.id_empresa, this.trabalho.codigo)
          .subscribe(
            async (data: any) => {
              await this.openSnackBar_OK(data.message, 'OK');
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

  onSubmit() {
    console.log('this.formulario', this.formulario);
    if (this.formulario.valid) {
      this.executaAcao();
      this.getTrabalhos();
    } else {
      this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
    }
  }

  setValue() {
    this.formulario.setValue({
      codigo: this.trabalho.codigo,
      descricao: this.trabalho.descricao,
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
    this.idAcao = 99;
    this.setAcao(99);
  }

  onRetorno() {
    this.router.navigate(['/tarefas']);
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

  getTexto() {
    return MensagensBotoes;
  }
}
