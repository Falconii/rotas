import { horahexa, MensagensBotoes } from 'src/app/shared/util';
import { SharedModule } from './../../shared/shared.module';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UsuarioQuery01Model } from './../../Models/usuario-query_01-model';
import { UsuarioModel } from 'src/app/Models/usuario-model';
import { TarefasService } from 'src/app/services/tarefas.service';
import { ParametroTarefa01 } from './../../parametros/parametro-tarefa01';
import { TarefaModel } from 'src/app/Models/tarefa-model';
import { ParametroTarefaProjeto01 } from './../../parametros/parametro-tarefa-projeto01';
import { TarefaProjetoService } from './../../services/tarefa-projeto.service';
import { TarefaProjetoModel } from './../../Models/tarefa-projeto-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { Subscription } from 'rxjs';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario-01';

@Component({
  selector: 'app-crud-tarefasProjetos-projetos',
  templateUrl: './crud-tarefas-projetos.component.html',
  styleUrls: ['./crud-tarefas-projetos.component.css'],
})
export class CrudTarefasProjetosComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoRota!: Subscription;

  tarefas: TarefaModel[] = [];

  responsaveis: UsuarioQuery01Model[] = [];

  tarefasProjetos: TarefaProjetoModel[] = [];

  tarefaProjeto: TarefaProjetoModel = new TarefaProjetoModel();

  formulario: FormGroup;

  erro: string = '';

  id_empresa = 0;

  codigo_projeto: number = 0;

  descricao_projeto: string = '';

  durationInSeconds = 3;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  readOnlyKey: boolean = true;

  labelCadastro: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private tarefaProjetoService: TarefaProjetoService,
    private tarefasService: TarefasService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '' }],
      inicial: [],
      final: [],
      status: [],
      id_tarefa: [{ value: '' }, [Validators.required, Validators.min(1)]],
      tarefa_descricao: [],
      id_resp: [{ value: '' }, [Validators.required, Validators.min(1)]],
      resp_razao: [],
      obs: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      horasplan: [],
      horasexec: [],
    });
    this.tarefaProjeto = new TarefaProjetoModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.codigo_projeto = params.projeto;
      this.descricao_projeto = params.descricao;
      this.idAcao = 99;
      this.setAcao(99);
    });

    this.getTarefas();

    this.getResponsaveis();
  }

  ngOnInit(): void {
    this.getTarefasProjetos();
  }

  ngOnDestroy(): void {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
  }

  getTarefasProjetos() {
    let par = new ParametroTarefaProjeto01();

    par.id_empresa = this.id_empresa;

    par.id_projeto = this.codigo_projeto;

    par.orderby = 'Código';

    this.inscricaoGetFiltro = this.tarefaProjetoService
      .getTarefasProjetos_01(par)
      .subscribe(
        (data: TarefaProjetoModel[]) => {
          this.tarefasProjetos = data;
        },
        (error: any) => {
          if (error.error.message == 'Nehuma Informação Para Esta Consulta.') {
            let trab = new TarefaProjetoModel();
            trab.id_empresa = this.id_empresa;
            trab.id = 0;
            trab.user_insert = 1;
            this.tarefasProjetos = [];
            this.tarefasProjetos.push(trab);
            this.openSnackBar_OK('Favor Cadastrar O Primeiro Tarefa OK', 'OK');
          } else {
            this.tarefasProjetos = [];
            this.openSnackBar_Err(
              `Pesquisa Nos Tarefas Do Projeto ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
        }
      );
  }

  getTarefas() {
    let par = new ParametroTarefa01();

    par.id_empresa = this.id_empresa;

    par.tarefa = 'S';

    par.tar_no_project = 'S';

    par.id_projeto = this.codigo_projeto;

    par.orderby = 'Código';

    this.inscricaoGetFiltro = this.tarefasService.getTarefas_01(par).subscribe(
      (data: TarefaModel[]) => {
        this.tarefas = data;
      },
      (error: any) => {
        this.tarefas = [];
      }
    );
  }

  getResponsaveis() {
    let par = new ParametroUsuario01();

    par.id_empresa = this.id_empresa;

    par.orderby = 'Código';

    this.inscricaoGetFiltro = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: UsuarioQuery01Model[]) => {
          this.responsaveis = data;
        },
        (error: any) => {
          this.responsaveis = [];
          this.openSnackBar_Err(
            `Pesquisa Nos Tarefas Do Projeto ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  escolha(tarefaProjeto: TarefaProjetoModel, opcao: number) {
    if (opcao == CadastroAcoes.Inclusao) {
      this.tarefaProjeto = new TarefaProjetoModel();
      this.tarefaProjeto.id_empresa = this.id_empresa;
      this.tarefaProjeto.id_projeto = this.codigo_projeto;
    } else {
      this.tarefaProjeto = tarefaProjeto;
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
    this.tarefaProjeto.id_empresa = this.id_empresa;
    this.tarefaProjeto.id_projeto = this.codigo_projeto;
    this.tarefaProjeto.id_tarefa = this.formulario.value.id_tarefa;
    this.tarefaProjeto.id_resp = this.formulario.value.id_resp;
    this.tarefaProjeto.inicial = this.formulario.value.inicial;
    this.tarefaProjeto.final = this.formulario.value.final;
    this.tarefaProjeto.obs = this.formulario.value.obs;
    this.tarefaProjeto.seq = 1;
    this.tarefaProjeto.horasplan = 0;
    this.tarefaProjeto.horasexec = 0;
    console.log('Tarefa => ', this.tarefaProjeto);
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.tarefaProjetoService
          .TarefaProjetoInsert(this.tarefaProjeto)
          .subscribe(
            async (data: TarefaProjetoModel) => {
              await this.openSnackBar_OK(
                `Tarefa Cadastrada Na Código: ${data.id}`,
                'OK'
              );
              this.onCancel();
              this.getTarefas();
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
        this.inscricaoAcao = this.tarefaProjetoService
          .TarefaProjetoUpdate(this.tarefaProjeto)
          .subscribe(
            async (data: any) => {
              await this.openSnackBar_OK(data.message, 'OK');
              this.onCancel();
              this.getTarefas();
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
        this.inscricaoAcao = this.tarefaProjetoService
          .TarefaProjetoDelete(
            this.tarefaProjeto.id_empresa,
            this.tarefaProjeto.id
          )
          .subscribe(
            async (data: any) => {
              await this.openSnackBar_OK(data.message, 'OK');
              this.onCancel();
              this.getTarefas();
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
      this.getTarefasProjetos();
    } else {
      this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
    }
  }

  setValue() {
    this.formulario.setValue({
      id: this.tarefaProjeto.id,
      id_tarefa: this.tarefaProjeto.id_tarefa,
      id_resp: this.tarefaProjeto.id_resp,
      inicial: this.tarefaProjeto.inicial,
      final: this.tarefaProjeto.final,
      status: this.tarefaProjeto.status,
      obs: this.tarefaProjeto.obs,
      tarefa_descricao:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.tarefaProjeto.tarefa_descricao
          : '',
      resp_razao:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.tarefaProjeto.resp_razao
          : '',
      horasplan: horahexa(this.tarefaProjeto.horasplan),
      horasexec: horahexa(this.tarefaProjeto.horasexec),
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
    this.router.navigate(['/projetos']);
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
