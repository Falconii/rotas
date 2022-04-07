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
import { MensagensBotoes } from 'src/app/shared/util';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  inscricaoGetEstruturas!: Subscription;
  inscricaoGetAtividade!: Subscription;

  projeto: ProjetoModel = new ProjetoModel();

  executores: UsuarioQuery01Model[] = [];

  atividades: AtividadeQuery_01Model[] = [];

  estruturas: EstruturaModel[] = [];

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

  filtro: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private estruturasService: EstruturasService,
    private atividadesService: AtividadesService,
    private usuariosService: UsuariosService,
    private projetosService: ProjetosService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      subconta: [{ value: '' }],
      inicial: [],
      final: [],
      id_resp: [],
      status: [],
      id_exec: [],
      obs: [],
    });
    this.parametros = formBuilder.group({
      conta: [{ value: '' }, [Validators.required, Validators.minLength(2)]],
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
    this.getExecutores();
  }

  ngOnDestroy(): void {
    this.inscricaoAnexar?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoGetProjeto?.unsubscribe();
    this.inscricaoGetEstruturas?.unsubscribe();
    this.inscricaoGetAtividade?.unsubscribe();
  }

  getProjeto() {
    this.inscricaoGetProjeto = this.projetosService
      .getProjeto(this.id_empresa, this.id_projeto)
      .subscribe(
        (data: ProjetoModel) => {
          this.projeto = data;
          this.getEstruturas();
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa  Projeto ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
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
          console.log(this.atividade);
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

  getAtividades() {
    let par = new ParametroAtividade01();

    par.id_empresa = this.id_empresa;

    par.conta = this.conta;

    par.id_projeto = this.id_projeto;

    this.inscricaoGetFiltro = this.atividadesService
      .getAtividades_01(par)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.atividades = data;
          console.log(this.atividades);
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
          this.atividades = data;
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

  getEstruturas() {
    let par = new ParametroEstrutura01();

    par.id_empresa = this.id_empresa;

    par.nivel = 1;

    par.orderby = 'Conta';

    this.inscricaoGetEstruturas = this.estruturasService
      .getEstruturas(par)
      .subscribe(
        (data: EstruturaModel[]) => {
          this.estruturas = data;
          this.setParamentos();
        },
        (error: any) => {
          this.estruturas = [];
          this.openSnackBar_Err(
            `Pesquisa Nos Tarefas Do Projeto ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
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
    this.atividade.id_empresa = this.id_empresa;
    this.atividade.id_projeto = this.id_projeto;
    switch (+this.idAcao) {
      case CadastroAcoes.Edicao:
        this.inscricaoAcao = this.atividadesService
          .atividadeUpdate(this.atividade)
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
      this.getAtividades();
    } else {
      this.openSnackBar_OK(`Informe Uma Estrutura Primeiro`, 'OK');
    }
  }

  setValue() {
    this.formulario.setValue({
      subconta: this.atividade.subconta,
      inicial: this.atividade.inicial,
      final: this.atividade.final,
      id_resp: this.atividade.id_resp,
      id_exec: this.atividade.id_exec,
      obs: this.atividade.obs,
      status: '',
    });
  }

  setParamentos() {
    this.parametros.setValue({
      conta: this.conta,
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
}
