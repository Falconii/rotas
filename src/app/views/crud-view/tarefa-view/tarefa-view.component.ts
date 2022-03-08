import { TarefasService } from 'src/app/services/tarefas.service';
import { TarefaModel } from 'src/app/Models/tarefa-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tarefa-view',
  templateUrl: './tarefa-view.component.html',
  styleUrls: ['./tarefa-view.component.css'],
})
export class TarefaViewComponent implements OnInit {
  formulario: FormGroup;

  tarefa: TarefaModel = new TarefaModel();

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  ReadOnlyKey: boolean = false;

  inscricaoGet!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;

  durationInSeconds = 2;

  labelCadastro: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private tarefaService: TarefasService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      codigo: ['', [Validators.required]],
      descricao: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ],
      ],
    });
    this.tarefa = new TarefaModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.tarefa.id_empresa = params.id_empresa;
      this.tarefa.codigo = params.codigo;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
  }

  ngOnInit(): void {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      this.tarefa = new TarefaModel();
      this.tarefa.id_empresa = 1;
    } else {
      this.getTarefa();
    }

    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGet?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  onSubmit() {
    console.log('this.formulario', this.formulario);
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
    }
  }

  setValue() {
    this.formulario.setValue({
      codigo: this.tarefa.codigo,
      descricao: this.tarefa.descricao,
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
    this.router.navigate(['/tarefas']);
  }

  getTarefa() {
    this.inscricaoGet = this.tarefaService
      .getTarefa(this.tarefa.id_empresa, this.tarefa.codigo)
      .subscribe(
        (data: TarefaModel) => {
          this.tarefa = data;
          this.setValue();
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa Nas Tarefas ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Tarefa - Inclusão.';
        this.readOnly = false;
        this.ReadOnlyKey = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Tarefa - Alteração.';
        this.readOnly = false;
        this.ReadOnlyKey = true;

        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Tarefa - Consulta.';
        this.readOnly = true;
        this.ReadOnlyKey = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Tarefa - Exclusão.';
        this.readOnly = true;
        this.ReadOnlyKey = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.tarefa.codigo = this.formulario.value.codigo;
    this.tarefa.descricao = this.formulario.value.descricao;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.tarefaService
          .TarefaInsert(this.tarefa)
          .subscribe(
            async (data: TarefaModel) => {
              await this.openSnackBar_OK(`Tarefa Cadastrada Com Sucesso`, 'OK');
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
        this.inscricaoAcao = this.tarefaService
          .TarefaUpdate(this.tarefa)
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
        this.inscricaoAcao = this.tarefaService
          .TarefaDelete(this.tarefa.id_empresa, this.tarefa.codigo)
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
}
