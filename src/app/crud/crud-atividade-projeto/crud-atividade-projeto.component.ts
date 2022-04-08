import { ClientesQuery01Model } from './../../Models/cliente-query_01-model';
import { ParametroCliente01 } from './../../parametros/parametro-cliente-01';
import { ClientesService } from './../../services/clientes.service';
import { ClientesModel } from './../../Models/cliente-model';
import { ParametroAtividade01 } from './../../parametros/parametro-atividade01';
import { ParametroEstrutura01 } from 'src/app/parametros/parametro-estrutura01';
import { ProjetosService } from './../../services/projetos.service';
import { AtividadesService } from './../../services/atividades.service';
import { AtividadeModel } from './../../Models/atividade-model';
import { EstruturasService } from 'src/app/services/estruturas.service';
import { EstruturaModel } from 'src/app/Models/estrutura-model';
import { AtividadeQuery_01Model } from './../../Models/atividade-query_01-model';
import { ProjetoModel } from './../../Models/projeto-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { DataYYYYMMDD, MensagensBotoes } from 'src/app/shared/util';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ActivatedRoute, PreloadAllModules, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario-01';

@Component({
  selector: 'app-crud-atividade-projeto',
  templateUrl: './crud-atividade-projeto.component.html',
  styleUrls: ['./crud-atividade-projeto.component.css'],
})
export class CrudAtividadeProjetoComponent implements OnInit {
  inscricaoAnexar!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoGetProjeto!: Subscription;
  inscricaoGetEstruturasIn!: Subscription;
  inscricaoGetEstruturasOff!: Subscription;
  inscricaoGetAtividade!: Subscription;
  inscricaoGetSubCliente!: Subscription;

  projeto: ProjetoModel = new ProjetoModel();

  executores: UsuarioQuery01Model[] = [];

  subclientes: ClientesQuery01Model[] = [];

  atividades: AtividadeQuery_01Model[] = [];

  estruturasIn: EstruturaModel[] = [];

  estruturasOff: EstruturaModel[] = [];

  atividade: AtividadeModel = new AtividadeModel();

  formulario: FormGroup;

  parametros: FormGroup;

  erro: string = '';

  id_empresa = 0;

  id_projeto = 0;

  durationInSeconds = 3;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  readOnlyKey: boolean = true;

  labelCadastro: string = '';

  conta: string = '';

  id_atividade_conta = '';

  filtro: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private estruturasService: EstruturasService,
    private atividadesService: AtividadesService,
    private usuariosService: UsuariosService,
    private projetosService: ProjetosService,
    private clientesService: ClientesService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      subconta: [{ value: '' }],
      inicial: [],
      final: [],
      id_resp: [{ value: '' }, [Validators.required, Validators.min(1)]],
      status: [],
      id_exec: [{ value: '' }, [Validators.required, Validators.min(1)]],
      id_subcliente: [{ value: '' }, [Validators.required, Validators.min(1)]],
      obs: [{ value: '' }, [Validators.min(60)]],
    });
    this.parametros = formBuilder.group({
      conta: [{ value: '' }],
      atividade: [{ value: '' }],
    });
    this.projeto = new ProjetoModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.id_projeto = params.id_projeto;
      this.idAcao = 99;
      this.setAcao(99);
    });
    this.getProjeto();
  }

  ngOnInit(): void {
    this.setParamentos();
    this.getExecutores();
  }

  ngOnDestroy(): void {
    this.inscricaoAnexar?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoGetProjeto?.unsubscribe();
    this.inscricaoGetEstruturasIn?.unsubscribe();
    this.inscricaoGetEstruturasOff?.unsubscribe();
    this.inscricaoGetAtividade?.unsubscribe();
    this.inscricaoGetSubCliente?.unsubscribe();
  }

  getProjeto() {
    this.inscricaoGetProjeto = this.projetosService
      .getProjeto(this.id_empresa, this.id_projeto)
      .subscribe(
        (data: ProjetoModel) => {
          this.projeto = data;
          this.getEstruturasIn();
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa  Projeto ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }
  getSubClientes() {
    console.log('Olha o projeto', this.projeto);

    let par = new ParametroCliente01();

    par.id_empresa = this.id_empresa;

    par.grupo = this.projeto.cliente_gru_econo;

    par.orderby = 'Razão';
    this.inscricaoGetSubCliente = this.clientesService
      .getClientes_01(par)
      .subscribe(
        (data: ClientesQuery01Model[]) => {
          this.subclientes = data;
        },
        (error: any) => {
          this.atividades = [];
          this.openSnackBar_Err(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getAtividade(id_empresa: number, id_atividade: number) {
    this.inscricaoGetAtividade = this.atividadesService
      .getAtividade(id_empresa, id_atividade)
      .subscribe(
        (data: AtividadeModel) => {
          this.atividade = data;
          this.setValue();
        },
        (error: any) => {
          this.atividade = new AtividadeModel();
          this.openSnackBar_Err(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getAtividades() {
    let par = new ParametroAtividade01();

    par.id_empresa = this.id_empresa;

    par.conta = this.id_atividade_conta;

    par.id_projeto = this.id_projeto;

    par.orderby = 'projeto';

    this.inscricaoGetFiltro = this.atividadesService
      .getAtividades_01(par)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.atividades = data;
          console.log('atividades', this.atividades);
        },
        (error: any) => {
          this.atividades = [];
          this.openSnackBar_Err(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
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
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  anexarAtividades() {
    this.inscricaoAnexar = this.atividadesService
      .anexaatividade(this.id_empresa, this.conta, this.id_projeto)
      .subscribe(
        (data: any) => {
          this.atividades = [];
          this.conta = '';
          this.getProjeto();
          this.openSnackBar_OK(`Estrutura Anexada Com Sucesso!`, 'OK');
        },
        (error: any) => {
          this.openSnackBar_Err(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  desanexarAtividades(id_empresa: number, conta: string, id_projeto: number) {
    this.inscricaoAnexar = this.atividadesService
      .desanexaatividade(id_empresa, conta, id_projeto)
      .subscribe(
        (data: any) => {
          this.atividades = [];
          this.conta = '';
          this.getProjeto();
          this.openSnackBar_OK(`Estrutura Excluída Com Sucesso!`, 'OK');
        },
        (error: any) => {
          console.log(error);
          this.openSnackBar_Err(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getEstruturasOff() {
    let par = new ParametroEstrutura01();

    par.id_empresa = this.id_empresa;

    par.nivel = 1;

    par.projeto_off = 'S';

    par.id_projeto = this.id_projeto;

    par.orderby = 'Conta';

    this.inscricaoGetEstruturasOff = this.estruturasService
      .getEstruturas(par)
      .subscribe(
        (data: EstruturaModel[]) => {
          this.estruturasOff = data;
        },
        (error: any) => {
          this.estruturasOff = [];
        }
      );
  }

  getEstruturasIn() {
    let par = new ParametroEstrutura01();

    par.id_empresa = this.id_empresa;

    par.nivel = 1;

    par.projeto_in = 'S';

    par.id_projeto = this.id_projeto;

    par.orderby = 'Conta';

    this.inscricaoGetEstruturasIn = this.estruturasService
      .getEstruturas(par)
      .subscribe(
        (data: EstruturaModel[]) => {
          this.estruturasIn = data;
          console.log('EstruturaIn', this.estruturasIn);
          this.getSubClientes();
          this.getEstruturasOff();
        },
        (error: any) => {
          this.estruturasIn = [];
          this.getSubClientes();
          this.getEstruturasOff();
          console.log('erro', error);
        }
      );
  }

  escolha(atividade: AtividadeQuery_01Model, opcao: number) {
    this.idAcao = opcao;
    this.setAcao(this.idAcao);
    this.getAtividade(atividade.id_empresa, atividade.id);
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Atividade - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Atividade - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Atividade - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Atividade - Exclusão.';
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
    this.atividade.inicial = this.formulario.value.inicial;
    this.atividade.final = this.formulario.value.final;
    this.atividade.id_resp = this.formulario.value.id_resp;
    this.atividade.id_exec = this.formulario.value.id_exec;
    this.atividade.id_subcliente = this.formulario.value.id_subcliente;
    this.atividade.obs = this.formulario.value.obs;
    switch (+this.idAcao) {
      case CadastroAcoes.Edicao:
        this.inscricaoAcao = this.atividadesService
          .atividadeUpdate(this.atividade)
          .subscribe(
            async (data: any) => {
              this.onCancel();
              this.refreshAtividade(this.atividade);
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
      default:
        break;
    }
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
    }
  }

  onAnexar() {
    if (this.parametros.value.conta?.trim() != '') {
      this.conta = this.parametros.value.conta?.trim();
      this.setParamentos();
      this.filtro = false;
      this.anexarAtividades();
    } else {
      this.openSnackBar_OK(`Informe Uma Estrutura Primeiro`, 'OK');
    }
  }

  onVisualizar() {
    if (this.parametros.value.atividade?.trim() != '') {
      this.id_atividade_conta = this.parametros.value.atividade?.trim();
      this.setParamentos();
      this.filtro = false;
      this.getAtividades();
    } else {
      this.openSnackBar_OK(`Informe Uma Atividade Primeiro`, 'OK');
    }
  }

  setValue() {
    this.formulario.setValue({
      subconta: this.atividade.subconta,
      inicial: this.atividade.inicial,
      final: this.atividade.final,
      id_resp: this.atividade.id_resp,
      id_exec: this.atividade.id_exec,
      id_subcliente: this.atividade.id_subcliente,
      obs: this.atividade.obs,
      status: '',
    });
  }

  setParamentos() {
    this.parametros.setValue({
      conta: this.conta,
      atividade: this.id_atividade_conta,
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

  onExcluir(atividade: AtividadeQuery_01Model) {
    this.desanexarAtividades(
      atividade.id_empresa,
      atividade.conta,
      atividade.id_projeto
    );
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

  setFiltro() {
    this.filtro = !this.filtro;
  }

  getFiltro(atividade: AtividadeQuery_01Model): Boolean {
    if (this.filtro) {
      if (atividade.tipo == 'O') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  refreshAtividade(atividade: AtividadeModel) {
    this.atividades.forEach((ativ) => {
      if (ativ.id == atividade.id) {
        ativ.inicial = DataYYYYMMDD(this.formulario.value.inicial);
        ativ.final = DataYYYYMMDD(this.formulario.value.final);
        ativ.id_resp = this.formulario.value.id_resp;
        ativ.resp_razao = this.getRazao(this.formulario.value.id_resp);
        ativ.id_exec = this.formulario.value.id_exec;
        ativ.exec_razao = this.getRazao(this.formulario.value.id_exec);
        ativ.id_subcliente = this.formulario.value.id_subcliente;
        ativ.obs = this.formulario.value.obs;
      }
    });
  }

  getRazao(value: number): string {
    let retorno: string = '';
    this.executores.forEach((exec) => {
      if (exec.id == value) retorno = exec.razao;
    });
    return retorno;
  }
}
