import { MensagensBotoes } from 'src/app/shared/util';
import { ParametroTarefaProjeto01 } from './../../parametros/parametro-tarefa-projeto01';
import { TarefasService } from './../../services/tarefas.service';
import { TarefaProjetoService } from './../../services/tarefa-projeto.service';
import { ParametroTrabalhoProjeto01 } from './../../parametros/parametro-trabalho-projeto01';
import { TrabalhoProjetoService } from './../../services/trabalho-projeto.service';
import { TrabalhoProjetoModel } from './../../Models/trabalho-projeto-model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { TarefaProjetoModel } from 'src/app/Models/tarefa-projeto-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario-01';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { ParametroTarefa01 } from 'src/app/parametros/parametro-tarefa01';
import { TarefaModel } from 'src/app/Models/tarefa-model';

@Component({
  selector: 'app-crud-trabalhos-projetos',
  templateUrl: './crud-trabalhos-projetos.component.html',
  styleUrls: ['./crud-trabalhos-projetos.component.css'],
})
export class CrudTrabalhosProjetosComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoGetTarefa!: Subscription;

  trabalho: TrabalhoProjetoModel = new TrabalhoProjetoModel();

  executores: UsuarioQuery01Model[] = [];

  trabalhosProjetos: TrabalhoProjetoModel[] = [];

  tarefaProjeto: TarefaProjetoModel = new TarefaProjetoModel();

  formulario: FormGroup;

  erro: string = '';

  id_empresa = 0;

  id_tarefaProjeto = 0;

  durationInSeconds = 3;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  readOnlyKey: boolean = true;

  labelCadastro: string = '';

  trabalhos: TarefaModel[] = [];

  tarefa: TarefaModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tarefaProjetoService: TarefaProjetoService,
    private trabalhoProjetoService: TrabalhoProjetoService,
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
      resp_razao: [],
      status: [],
      id_trabalho: [{ value: '' }, [Validators.required, Validators.min(1)]],
      trabalho_descricao: [],
      id_exec: [{ value: '' }, [Validators.required, Validators.min(1)]],
      exec_razao: [],
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
    this.trabalho = new TrabalhoProjetoModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.id_tarefaProjeto = params.id;
      this.idAcao = 99;
      this.setAcao(99);
      this.getTarefa();
    });

    this.getExecutores();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoGetTarefa?.unsubscribe();
  }

  getTarefa() {
    let par = new ParametroTarefaProjeto01();

    par.id_empresa = this.id_empresa;

    par.id = this.id_tarefaProjeto;

    par.orderby = 'Código';

    this.inscricaoGetFiltro = this.tarefaProjetoService
      .getTarefasProjetos_01(par)
      .subscribe(
        (data: TarefaProjetoModel[]) => {
          this.tarefaProjeto = data[0];
          console.log('tarefaProjeto', this.tarefaProjeto);
          this.getTrabalhosProjetos();
        },
        (error: any) => {
          this.tarefaProjeto = new TarefaProjetoModel();
          this.openSnackBar_Err(
            `Pesquisa Nas Tarefas Do Projeto ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getTrabalhos() {
    let par = new ParametroTarefa01();

    par.id_empresa = this.id_empresa;

    par.trabalho = 'S';

    par.trab_no_project = 'S';

    par.id_projeto = this.tarefaProjeto.id_projeto;

    par.codigo = this.tarefaProjeto.id_tarefa;

    par.orderby = 'Código';

    console.log('Pegado os trabalhos', par);

    this.inscricaoGetFiltro = this.tarefasService.getTarefas_01(par).subscribe(
      (data: TarefaModel[]) => {
        this.trabalhos = data;
        console.log('trabalhos', this.trabalhos);
      },
      (error: any) => {
        this.trabalhos = [];
      }
    );
  }

  getTrabalhosProjetos() {
    let par = new ParametroTrabalhoProjeto01();

    par.id_empresa = this.tarefaProjeto.id_empresa;

    par.id_projeto = this.tarefaProjeto.id_projeto;

    par.orderby = 'Código';

    this.inscricaoGetFiltro = this.trabalhoProjetoService
      .getTrabalhosProjetos_01(par)
      .subscribe(
        (data: TrabalhoProjetoModel[]) => {
          this.trabalhosProjetos = data;
          this.getTrabalhos();
        },
        (error: any) => {
          if (error.error.message == 'Nehuma Informação Para Esta Consulta.') {
            let trab = new TrabalhoProjetoModel();
            trab.id_empresa = this.id_empresa;
            trab.id = 0;
            trab.user_insert = 1;
            this.trabalhosProjetos = [];
            this.trabalhosProjetos.push(trab);
            this.openSnackBar_OK(
              'Favor Cadastrar O Primeiro Trabalho OK',
              'OK'
            );
            this.getTrabalhos();
          } else {
            this.trabalhosProjetos = [];
            this.openSnackBar_Err(
              `Pesquisa Nos Tarefas Do Projeto ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
        }
      );
  }

  getExecutores() {
    let par = new ParametroUsuario01();

    par.id_empresa = this.id_empresa;

    par.orderby = 'Código';

    this.inscricaoGetFiltro = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: UsuarioQuery01Model[]) => {
          this.executores = data;
        },
        (error: any) => {
          this.executores = [];
          this.openSnackBar_Err(
            `Pesquisa Nos Tarefas Do Projeto ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  escolha(trabalho: TrabalhoProjetoModel, opcao: number) {
    if (opcao == 99) {
      this.trabalho = trabalho;
      this.router.navigate([
        '/planejamentolancamento',
        this.trabalho.id_empresa,
        this.trabalho.id,
      ]);
    }
    if (opcao == CadastroAcoes.Inclusao) {
      this.trabalho = new TrabalhoProjetoModel();
      this.trabalho.id_empresa = this.id_empresa;
      this.trabalho.id_projeto = this.tarefaProjeto.id_projeto;
      this.trabalho.id_tarefa = this.tarefaProjeto.id_tarefa;
      this.trabalho.id_resp = this.tarefaProjeto.id_resp;
      this.trabalho.resp_razao = this.tarefaProjeto.resp_razao;
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
    this.trabalho.id_empresa = this.id_empresa;
    this.trabalho.id_trabalho = this.formulario.value.id_trabalho;
    this.trabalho.id_exec = this.formulario.value.id_exec;
    this.trabalho.inicial = this.formulario.value.inicial;
    this.trabalho.final = this.formulario.value.final;
    this.trabalho.obs = this.formulario.value.obs;
    this.trabalho.seq = 1;
    this.trabalho.horasplan = 1;
    this.trabalho.horasexec = 1;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.trabalhoProjetoService
          .TrabalhoProjetoInsert(this.trabalho)
          .subscribe(
            async (data: TrabalhoProjetoModel) => {
              await this.openSnackBar_OK(
                `Trabalho Cadastrado Na Código: ${data.id}`,
                'OK'
              );
              this.onCancel();
              this.getTrabalhosProjetos();
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
        this.inscricaoAcao = this.trabalhoProjetoService
          .TrabalhoProjetoUpdate(this.trabalho)
          .subscribe(
            async (data: any) => {
              await this.openSnackBar_OK(data.message, 'OK');
              this.onCancel();
              this.getTrabalhosProjetos();
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
        this.inscricaoAcao = this.trabalhoProjetoService
          .TrabalhoProjetoDelete(this.trabalho.id_empresa, this.trabalho.id)
          .subscribe(
            async (data: any) => {
              await this.openSnackBar_OK(data.message, 'OK');
              this.onCancel();
              this.getTrabalhosProjetos();
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
      console.log('Comecei a Gravação...');
      this.executaAcao();
    } else {
      this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
    }
  }

  setValue() {
    this.formulario.setValue({
      id: this.trabalho.id,
      id_trabalho: this.trabalho.id_trabalho,
      inicial: this.trabalho.inicial,
      final: this.trabalho.final,
      resp_razao: this.trabalho.resp_razao,
      status: this.trabalho.status,
      id_exec: this.trabalho.id_exec,
      exec_razao: this.trabalho.exec_razao,
      obs: this.trabalho.obs,
      trabalho_descricao:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Edicao ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.trabalho.trab_descricao
          : '',
      horasplan: this.trabalho.horasplan,
      horasexec: this.trabalho.horasexec,
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
    console.log('Retornando....');
    this.router.navigate(['/trabalhosprojetos']);
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
