import { ParametroMotivoApo01 } from './../../parametros/parametro-motivo-apo01';
import { MotivoApoService } from './../../services/motivo-apo.service';
import { AtividadeQuery_01Model } from './../../Models/atividade-query_01-model';
import { ApoPlanejamentoQuery_01Model } from './../../Models/apo-planejamento-query_01-model';
import { ParametroAgendaPlanejamento01 } from './../../parametros/parametro-agenda-planejamento01';
import { ParametroAponExecucao01 } from './../../parametros/parametro-apon-execucao01';
import { AponExecucaoService } from './../../services/apon-execucao.service';
import { UsuarioModel } from './../../Models/usuario-model';
import { UsuariosService } from './../../services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApoExecucaoModel } from 'src/app/Models/apo-execucao-model';
import { MoviData } from 'src/app/Models/movi-data';
import { AponPlanejamentoService } from 'src/app/services/apon-planejamento.service';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import {
  DataYYYYMMDD,
  DataYYYYMMDDTHHMMSSZ,
  DifHoras,
  getHora,
  getMinuto,
  MensagensBotoes,
  minutostostohorasexagenal,
  populaIntervalo2,
  setDBtoAngular,
  setDBtoAngularGMT,
  setHorario,
  validaIntervalo,
} from 'src/app/shared/util';
import { EstruturaModel } from 'src/app/Models/estrutura-model';
import { ParametroAtividade01 } from 'src/app/parametros/parametro-atividade01';
import { AtividadesService } from 'src/app/services/atividades.service';
import { MotivoApoModel } from 'src/app/Models/motivo-apo-model';
import { Intervalo } from 'src/app/shared/intervalo';
import { ErrorIntervalo } from 'src/app/shared/error-intervalo';

@Component({
  selector: 'app-crud-execucao-lancamento',
  templateUrl: './crud-execucao-lancamento.component.html',
  styleUrls: ['./crud-execucao-lancamento.component.css'],
})
export class CrudExecucaoLancamentoComponent implements OnInit {
  durationInSeconds: number = 2;
  agendamento: MoviData = new MoviData();
  inscricaoGetAll!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoUsuario!: Subscription;
  inscricaoApontamento!: Subscription;
  inscricaoAponExecucao!: Subscription;
  inscricaoAtividades!: Subscription;
  inscricaoMotivos!: Subscription;
  idAcao: number = 0;
  acao: string = '';
  labelCadastro: string = '';
  id_empresa: number = 0;
  apontamentos: ApoExecucaoModel[] = [];
  apontamento: ApoExecucaoModel = new ApoExecucaoModel();
  agendamentos: ApoPlanejamentoQuery_01Model[] = [];
  atividades: AtividadeQuery_01Model[] = [];
  atividade: AtividadeQuery_01Model = new AtividadeQuery_01Model();
  motivos: MotivoApoModel[] = [];
  dados_projetos: string = 'Olá';
  usuario: UsuarioModel = new UsuarioModel();
  filtro: Boolean = false;
  formulario: FormGroup;
  parametro: FormGroup;
  intervalos: Intervalo[] = [];

  constructor(
    formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private aponPlanejamentoService: AponPlanejamentoService,
    private aponExecucaoService: AponExecucaoService,
    private atividadesService: AtividadesService,
    private motivoApoService: MotivoApoService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      entrada: [{ value: '' }, [Validators.required]],
      saida: [{ value: '' }, [Validators.required]],
      atividade: [{ value: '' }, [Validators.required]],
      cliente: [{ value: '' }, [Validators.required]],
      id_motivo: [{ value: '' }, [Validators.required]],
      encerra: [{ value: '' }, [Validators.required]],
      obs: [{ value: '' }, [Validators.maxLength(50)]],
    });
    this.parametro = formBuilder.group({
      data: [{ value: '' }],
      id_atividade: [{ value: '' }, [Validators.required, Validators.min(1)]],
    });
    this.setParametro();
    this.getUsuario();
    this.setValue();
    this.idAcao = 99;
    this.setAcao(this.idAcao);
    this.setValue();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoUsuario?.unsubscribe();
    this.inscricaoApontamento?.unsubscribe();
    this.inscricaoAponExecucao?.unsubscribe();
    this.inscricaoAtividades?.unsubscribe();
    this.inscricaoMotivos?.unsubscribe();
  }

  getUsuario() {
    this.inscricaoUsuario = this.usuariosService.getUsuario(1, 2).subscribe(
      (data: UsuarioModel) => {
        this.usuario = data;
        this.getAtividades();
        this.getMotivos();
      },
      (error: any) => {
        this.usuario = new UsuarioModel();
        this.openSnackBar_Err(
          `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
          'OK'
        );
      }
    );
  }

  getApontamentosPlanejamento() {
    let para = new ParametroAgendaPlanejamento01();
    para.id_empresa = this.usuario.id_empresa;
    para.id_exec = this.usuario.id;
    para.data = DataYYYYMMDD(this.parametro.value.data);
    para.orderby = 'Executor';
    this.inscricaoAponExecucao = this.aponPlanejamentoService
      .getApoPlanejamentos_01(para)
      .subscribe(
        (data: ApoPlanejamentoQuery_01Model[]) => {
          this.agendamentos = data;
        },
        (error: any) => {
          this.agendamentos = [];
        }
      );
  }

  getApontamentosExecucao() {
    let para = new ParametroAponExecucao01();
    para.id_empresa = 1;
    para.id_exec = this.usuario.id;
    para.id_projeto = this.atividade.id_projeto;
    para.data = DataYYYYMMDD(this.parametro.value.data);
    para.orderby = 'Executor';
    this.inscricaoAponExecucao = this.aponExecucaoService
      .getApoExecucoes_01(para)
      .subscribe(
        (data: ApoExecucaoModel[]) => {
          this.apontamentos = data;
        },
        (error: any) => {
          this.apontamentos = [];
        }
      );
  }

  getAtividades() {
    let para = new ParametroAtividade01();
    para.id_empresa = 1;
    para.id_exec = this.usuario.id;
    para.so_abertas_ex = 'S';
    para.orderby = 'descricao';
    this.inscricaoAponExecucao = this.atividadesService
      .getAtividades_01(para)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.atividades = data;
          console.log(this.atividades);
        },
        (error: any) => {
          this.atividades = [];
        }
      );
  }

  getMotivos() {
    let para = new ParametroMotivoApo01();
    para.id_empresa = 1;
    para.analitico = 'S';
    para.orderby = 'Código';
    this.inscricaoAponExecucao = this.motivoApoService
      .getMotivoApos_01(para)
      .subscribe(
        (data: MotivoApoModel[]) => {
          this.motivos = data;
        },
        (error: any) => {
          this.motivos = [];
          this.openSnackBar_Err(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  setValue() {
    this.formulario.setValue({
      entrada: this.apontamento.inicial.substring(
        this.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf(' ') + 1,
        16
      ),
      atividade: this.apontamento.estru_descricao,
      cliente: this.atividade.subcliente_razao,
      id_motivo: this.apontamento.id_motivo,
      encerra: this.apontamento.encerramento == 'S' ? true : false,
      obs: this.apontamento.obs,
    });
  }

  setParametro() {
    this.parametro.setValue({
      data: new Date(),
      id_atividade: 0,
    });
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        break;
      default:
        this.acao = '';
        this.labelCadastro = '';
        break;
    }
  }

  onRetorno() {
    this.router.navigate(['/']);
  }

  setFiltro() {
    this.filtro = !this.filtro;
  }

  openSnackBar_Err(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onSubmit() {
    try {
      if (
        this.idAcao == CadastroAcoes.Inclusao ||
        this.idAcao == CadastroAcoes.Edicao
      ) {
        console.log(
          'Edição =>',
          this.intervalos,
          this.formulario.value.entrada,
          this.formulario.value.saida
        );
        validaIntervalo(
          this.intervalos,
          this.formulario.value.entrada,
          this.formulario.value.saida
        );
      }
      if (this.formulario.valid) {
        this.executaAcao();
      } else {
        this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
      }
    } catch (err) {
      if (err instanceof ErrorIntervalo) {
        this.openSnackBar_OK(`Lançamento Conflitando: ${err.message}`, 'OK');
      } else {
        console.log(err);
      }
    }
  }

  onRefresh() {
    if (this.parametro.valid) {
      this.atividade = this.atividades.filter(
        (ativ) => ativ.id === this.parametro.value.id_atividade
      )[0];
      this.getApontamentosPlanejamento();
      this.getApontamentosExecucao();
    } else {
      this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
    }
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

  adicao(opcao: number) {
    if (!this.parametro.valid) {
      this.openSnackBar_OK(`Definina uma ativadade primeiro`, 'OK');
    } else {
      this.apontamento = new ApoExecucaoModel();
      const date1 = new Date(
        setDBtoAngularGMT(DataYYYYMMDD(this.parametro.value.data) + ' 00:00:00')
      );
      this.intervalos = populaIntervalo2(
        this.apontamentos,
        this.apontamento.id
      );
      console.log('Intervalos Adicao ==>', this.intervalos);
      this.apontamento.id_empresa = this.usuario.id_empresa;
      this.apontamento.id = 0;
      this.apontamento.id_projeto = this.atividade.id_projeto;
      this.apontamento.id_conta = this.atividade.conta;
      this.apontamento.id_subconta = this.atividade.subconta;
      this.apontamento.id_resp = this.atividade.id_resp;
      this.apontamento.id_exec = this.atividade.id_exec;
      this.apontamento.inicial = setDBtoAngularGMT(
        DataYYYYMMDD(this.parametro.value.data) + ' 00:00:00'
      ); //DataYYYYMMDDTHHMMSSZ(date1);
      this.apontamento.final = setDBtoAngularGMT(
        DataYYYYMMDD(this.parametro.value.data) + ' 00:00:00'
      ); //DataYYYYMMDDTHHMMSSZ(date1);
      this.apontamento.horasapon = 0;
      this.apontamento.obs = '';
      this.apontamento.encerramento = 'N';
      this.apontamento.user_insert = this.usuario.id;
      this.apontamento.user_update = 0;
      this.apontamento.resp_razao = this.atividade.resp_razao;
      this.apontamento.exec_razao = this.atividade.exec_razao;
      this.apontamento.estru_descricao = this.atividade.estru_descri;
      this.idAcao = opcao;
      this.setAcao(this.idAcao);
      this.labelCadastro = DataYYYYMMDDTHHMMSSZ(date1);
      this.setValue();
      console.log('inicial', this.apontamento.inicial);
      console.log('final', this.apontamento.final);
    }
  }

  outras(opcao: number, lanca: ApoExecucaoModel) {
    this.apontamento = lanca;
    this.intervalos = populaIntervalo2(this.apontamentos, this.apontamento.id);
    this.idAcao = opcao;
    this.setAcao(this.idAcao);
    this.setValue();
  }

  executaAcao() {
    let dataDia: Date = new Date();
    dataDia.setTime(Date.parse(this.apontamento.inicial));
    this.apontamento.inicial = setHorario(
      dataDia,
      getHora(this.formulario.value.entrada),
      getMinuto(this.formulario.value.entrada)
    );
    this.apontamento.final = setHorario(
      dataDia,
      getHora(this.formulario.value.saida),
      getMinuto(this.formulario.value.saida)
    );
    this.apontamento.horasapon = minutostostohorasexagenal(
      DifHoras(this.apontamento.inicial, this.apontamento.final)
    );
    this.apontamento.id_motivo = this.formulario.value.id_motivo;
    this.apontamento.obs = this.formulario.value.obs;
    this.apontamento.encerramento = this.formulario.value.encerra ? 'S' : 'N';
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.aponExecucaoService
          .ApoExecucaoInsert(this.apontamento)
          .subscribe(
            async (data: ApoExecucaoModel) => {
              this.getApontamentosExecucao();
              this.onCancel();
            },
            (error: any) => {
              this.openSnackBar_Err(
                `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.inscricaoAcao = this.aponExecucaoService
          .ApoExecucaoUpdate(this.apontamento)
          .subscribe(
            async (data: any) => {
              this.getApontamentosExecucao();
              this.onCancel();
            },
            (error: any) => {
              console.log('Error', error.error);
              this.openSnackBar_Err(
                `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.inscricaoAcao = this.aponExecucaoService
          .ApoExecucaoDelete(this.apontamento.id_empresa, this.apontamento.id)
          .subscribe(
            async (data: any) => {
              this.getApontamentosExecucao();
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

  onCancel() {
    this.idAcao = 99;
    this.setAcao(99);
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
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

  onAtividadeChange() {
    this.onRefresh();
  }

  getTitulo(): string {
    if (this.atividade.id !== 0) {
      return `Projeto: ${this.atividade.id_projeto} Atividade: ${this.atividade.estru_descri}`;
    } else {
      return 'Apontamentos de execução';
    }
  }

  showDadosProjetoAgendamento(lanca: ApoPlanejamentoQuery_01Model): string {
    let retorno = '';

    retorno = `Projeto: ${lanca.id_projeto} Diretor: ${lanca.diretor_razao} Resp.: ${lanca.resp_razao}`;

    return retorno;
  }

  showDadosProjetoApontamento(lanca: ApoExecucaoModel): string {
    let retorno = '';

    retorno = `Projeto: ${lanca.id_projeto} Descricao: ${lanca.proj_descricao} Resp.: ${lanca.resp_razao}`;

    return retorno;
  }
}
