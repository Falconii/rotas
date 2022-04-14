import { ParametroMotivoApo01 } from './../../parametros/parametro-motivo-apo01';
import { MotivoApoService } from './../../services/motivo-apo.service';
import { AtividadeModel } from 'src/app/Models/atividade-model';
import { AtividadeQuery_01Model } from './../../Models/atividade-query_01-model';
import { ApoPlanejamentoQuery_01Model } from './../../Models/apo-planejamento-query_01-model';
import { ParametroAgendaPlanejamento01 } from './../../parametros/parametro-agenda-planejamento01';
import { ApoPlanejamentoMoldel } from 'src/app/Models/apo-planejamento-moldel';
import { ParametroAponExecucao01 } from './../../parametros/parametro-apon-execucao01';
import { AponExecucaoService } from './../../services/apon-execucao.service';
import { UsuarioModel } from './../../Models/usuario-model';
import { UsuariosService } from './../../services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  setHorario,
} from 'src/app/shared/util';
import { EstruturaModel } from 'src/app/Models/estrutura-model';
import { ParametroAtividade01 } from 'src/app/parametros/parametro-atividade01';
import { AtividadesService } from 'src/app/services/atividades.service';
import { MotivoApoModel } from 'src/app/Models/motivo-apo-model';

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
      entrada: [{ value: '' }],
      saida: [{ value: '' }],
      atividade: [],
      id_motivo: [],
      encerra: [],
      obs: [{ value: '' }],
    });
    this.parametro = formBuilder.group({
      data: [{ value: '' }],
      id_atividade: [{ value: '' }],
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
    para.orderby = 'Responsável';
    this.inscricaoAponExecucao = this.aponPlanejamentoService
      .getApoPlanejamentos_01(para)
      .subscribe(
        (data: ApoPlanejamentoQuery_01Model[]) => {
          this.agendamentos = data;
        },
        (error: any) => {
          this.apontamentos = [];
          this.openSnackBar_Err(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getApontamentosExecucao() {
    let para = new ParametroAponExecucao01();
    para.id_empresa = 1;
    para.id_exec = this.usuario.id;
    para.data = DataYYYYMMDD(this.parametro.value.data);
    this.inscricaoAponExecucao = this.aponExecucaoService
      .getApoExecucoes_01(para)
      .subscribe(
        (data: ApoExecucaoModel[]) => {
          this.apontamentos = data;
        },
        (error: any) => {
          this.apontamentos = [];
          this.openSnackBar_Err(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getAtividades() {
    let para = new ParametroAtividade01();
    para.id_empresa = 1;
    para.id_exec = this.usuario.id;
    this.inscricaoAponExecucao = this.atividadesService
      .getAtividades_01(para)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.atividades = data;
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
        this.apontamento.inicial.indexOf('T') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf('T') + 1,
        16
      ),
      atividade: this.apontamento.estru_descricao,
      id_motivo: this.apontamento.id,
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
    console.log('formulario', this.formulario.value);
    if (this.formulario.valid) {
      //this.executaAcao();
    } else {
      this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
    }
  }

  onRefresh() {
    this.atividade = this.atividades.filter(
      (ativ) => ativ.id === this.parametro.value.id_atividade
    )[0];
    this.getApontamentosPlanejamento();
    this.getApontamentosExecucao();
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
    this.apontamento = new ApoExecucaoModel();
    const date1 = new Date(this.parametro.value.data);
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    let horas = DataYYYYMMDDTHHMMSSZ(date1).substring(
      DataYYYYMMDDTHHMMSSZ(date1).indexOf('T') + 1,
      16
    );
    this.apontamento.id_empresa = this.id_empresa;
    this.apontamento.id_empresa = 0;
    this.apontamento.id = 0;
    this.apontamento.id_projeto = this.atividade.id_projeto;
    this.apontamento.id_conta = this.atividade.conta;
    this.apontamento.id_subconta = this.atividade.subconta;
    this.apontamento.id_resp = this.atividade.id_resp;
    this.apontamento.id_exec = this.atividade.id_exec;
    this.apontamento.inicial = DataYYYYMMDDTHHMMSSZ(date1);
    this.apontamento.final = DataYYYYMMDDTHHMMSSZ(date1);
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
  }

  outras(opcao: number, lanca: ApoPlanejamentoQuery_01Model) {
    /*
    this.getApontamento(lanca.id_empresa, lanca.id);
    this.idAcao = opcao;
    this.setAcao(this.idAcao);
    */
  }

  executaAcao() {
    /*
    let dataDia: Date = new Date(this.agendamento.data);
    this.apontamento.id_empresa = this.id_empresa;
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
    this.apontamento.obs = this.formulario.value.obs;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.aponExecucaoService
          .ApoExecucaoIn(this.apontamento)
          .subscribe(
            async (data: ApoPlanejamentoMoldel) => {
              this.getAponAgendas();
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
        this.inscricaoAcao = this.aponPlanejamentoService
          .ApoPlanejamentoUpdate(this.apontamento)
          .subscribe(
            async (data: any) => {
              this.getAponAgendas();
              await this.openSnackBar_OK(data.message, 'OK');
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
        this.inscricaoAcao = this.aponPlanejamentoService
          .ApoPlanejamentoDelete(
            this.apontamento.id_empresa,
            this.apontamento.id
          )
          .subscribe(
            async (data: any) => {
              this.getAponAgendas();
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
    */
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
}
