import { ApoPlanejamentoMoldel } from './../../Models/apo-planejamento-moldel';
import { Dias_Planejados } from './../../shared/dias-planejados';
import { AponPlanejamentoService } from './../../services/apon-planejamento.service';
import { ParametroAgendaPlanejamento02 } from './../../parametros/parametro-agenda-planejamento02';
import { ParametroTrabalhoProjeto01 } from './../../parametros/parametro-trabalho-projeto01';
import { TrabalhoProjetoService } from './../../services/trabalho-projeto.service';
import { TrabalhoProjetoModel } from './../../Models/trabalho-projeto-model';
import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  DataYYYYMMDD,
  DataYYYYMMDDTHHMMSSZ,
  DiasUteis,
  DifHoras,
  formatarData,
  minutostostohorasexagenal,
} from 'src/app/shared/util';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  DialogExcluir,
  DialogExcluirComponent,
} from '../dialog-excluir/dialog-excluir.component';
import {
  DialogAlterar,
  DialogAlterarComponent,
} from '../dialog-alterar/dialog-alterar.component';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ResqPlanejamento } from 'src/app/Models/resq-planejamento';

@Component({
  selector: 'app-lancamento',
  templateUrl: './lancamento.component.html',
  styleUrls: ['./lancamento.component.css'],
})
export class LancamentoComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetTrabalho!: Subscription;
  inscricaoGetAgenda!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoLanca!: Subscription;
  inscricaoDelete!: Subscription;

  trabalho: TrabalhoProjetoModel = new TrabalhoProjetoModel();

  erro: string = '';

  durationInSeconds = 3;

  nro_dias = 0;

  mark: Boolean = false;

  paramentroAgenda: ParametroAgendaPlanejamento02 =
    new ParametroAgendaPlanejamento02();

  constructor(
    public dialog: MatDialog,
    private TrabalhoProjetoService: TrabalhoProjetoService,
    private aponPlanejamentoService: AponPlanejamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.trabalho.id_empresa = params.id_empresa;
      this.trabalho.id = params.id;
    });
    this.getTrabalho();
  }

  openDialogExcluir(value: Dias_Planejados): void {
    const dialogRef = this.dialog.open(DialogExcluirComponent, {
      width: '450px',
      data: {
        id_empresa: this.trabalho.id_empresa,
        data: value.data_,
        manha_estado: value.manha,
        tarde_estado: value.tarde,
        manha_id: value.manha_id_apo_planejamento,
        tarde_id: value.tarde_id_apo_planejamento,
      },
    });

    dialogRef.afterClosed().subscribe((result: DialogExcluir) => {
      this.deleteLancamento(result);
    });
  }

  openDialogAlterar(value: Dias_Planejados): void {
    console.log('Values Alterar', value);
    const dialogRef = this.dialog.open(DialogAlterarComponent, {
      width: '450px',
      data: {
        data: value.data,
        manha_estado: value.manha,
        tarde_estado: value.tarde,
        manha_op: this.getPeriodo(value.manha),
        tarde_op: this.getPeriodo(value.tarde),
        manha_obs: value.manha_obs,
        tarde_obs: value.tarde_obs,
      },
    });
    dialogRef.afterClosed().subscribe((result: DialogAlterar) => {
      console.log('value no retorno:', value);
      result.manha_estado = value.manha;
      result.tarde_estado = value.tarde;
      this.saveLancamento(value, result);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetAgenda?.unsubscribe();
    this.inscricaoGetTrabalho?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoLanca?.unsubscribe();
    this.inscricaoDelete?.unsubscribe();
  }

  getTrabalho() {
    let par = new ParametroTrabalhoProjeto01();

    par.id_empresa = this.trabalho.id_empresa;

    par.id = this.trabalho.id;

    this.inscricaoGetAgenda =
      this.TrabalhoProjetoService.getTrabalhosProjetos_01(par).subscribe(
        (data: TrabalhoProjetoModel[]) => {
          this.trabalho = data[0];
          this.getAgenda();
        },
        (error: any) => {
          this.trabalho = new TrabalhoProjetoModel();
          this.openSnackBar_Err(
            `Pesquisa TRabalhos Projetos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getAgenda() {
    this.paramentroAgenda = new ParametroAgendaPlanejamento02();

    this.paramentroAgenda.id_empresa = this.trabalho.id_empresa;

    this.paramentroAgenda.id_projeto = this.trabalho.id_projeto;

    this.paramentroAgenda.id_tarefa = this.trabalho.id_tarefa;

    this.paramentroAgenda.id_trabalho = this.trabalho.id_trabalho;

    this.paramentroAgenda.id_exec = this.trabalho.id_exec;

    this.paramentroAgenda.agenda = DiasUteis(
      formatarData(this.trabalho.inicial),
      formatarData(this.trabalho.final)
    );

    this.inscricaoGetAgenda = this.aponPlanejamentoService
      .getAponAgendaPlanejamentos(this.paramentroAgenda)
      .subscribe(
        (data: ParametroAgendaPlanejamento02) => {
          this.paramentroAgenda.agenda = data.agenda;
        },
        (error: any) => {
          this.paramentroAgenda.agenda = [];
          this.openSnackBar_Err(
            `Pesquisa Apontamento Planejamento ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }
  openSnackBar_Err(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  async openSnackBar_OK(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }

  onRetorno() {
    this.router.navigate([
      '/trabalhosprojetosmanu',
      this.trabalho.id_empresa,
      this.trabalho.id_projeto,
      this.trabalho.id_tarefa,
    ]);
  }

  getPeriodo(value: string) {
    if (value == '1' || value == '2') return 'Planejado';
    else return 'Vago';
  }

  excluir(value: Dias_Planejados) {
    this.openDialogExcluir(value);
  }

  alterar(value: Dias_Planejados) {
    this.openDialogAlterar(value);
  }

  getMark() {
    if (this.mark) return 'Desmarcar Todos';
    else return 'Marcar Todos';
  }

  onClickMark() {
    this.paramentroAgenda.agenda.forEach((age) => {
      age.mark = !this.mark;
    });
  }

  saveLancamento(value: Dias_Planejados, dialogRetorno: DialogAlterar) {
    let params: ResqPlanejamento[] = [];

    console.log('dialogRetorno:', dialogRetorno);

    if (
      dialogRetorno.manha_estado != '2' &&
      dialogRetorno.manha_op == 'Planejado' &&
      value.manha_id_apo_planejamento == 0
    ) {
      const lanca = new ApoPlanejamentoMoldel();

      const dtLanca1 = new Date(value.data);
      dtLanca1.setHours(7);
      dtLanca1.setMinutes(3);
      dtLanca1.setSeconds(0);
      const dtLanca2 = new Date(value.data);
      dtLanca2.setHours(12);
      dtLanca2.setMinutes(0);
      dtLanca2.setSeconds(0);

      lanca.id_empresa = this.trabalho.id_empresa;
      lanca.id = 0;
      lanca.id_projeto = this.trabalho.id_projeto;
      lanca.id_tarefa = this.trabalho.id_tarefa;
      lanca.id_trabalho = this.trabalho.id_trabalho;
      lanca.id_resp = this.trabalho.id_resp;
      lanca.id_exec = this.trabalho.id_exec;
      lanca.inicial = DataYYYYMMDDTHHMMSSZ(dtLanca1);
      lanca.final = DataYYYYMMDDTHHMMSSZ(dtLanca2);
      lanca.horasapon = minutostostohorasexagenal(
        DifHoras(lanca.inicial, lanca.final)
      );
      lanca.obs = dialogRetorno.manha_obs;
      lanca.encerra = 'N';
      lanca.user_insert = 1;
      lanca.user_update = 0;

      const param: ResqPlanejamento = new ResqPlanejamento();
      param.acao = 'I';
      param.lanca = lanca;
      params.push(param);

      //this.insertLancamento(lanca);
    }

    if (
      dialogRetorno.tarde_estado != '2' &&
      dialogRetorno.tarde_op == 'Planejado' &&
      value.tarde_id_apo_planejamento == 0
    ) {
      const lanca = new ApoPlanejamentoMoldel();
      const dtLanca1 = new Date(value.data);
      dtLanca1.setHours(13);
      dtLanca1.setMinutes(0);
      dtLanca1.setSeconds(0);
      const dtLanca2 = new Date(value.data);
      dtLanca2.setHours(17);
      dtLanca2.setMinutes(0);
      dtLanca2.setSeconds(0);

      lanca.id_empresa = this.trabalho.id_empresa;
      lanca.id = 0;
      lanca.id_projeto = this.trabalho.id_projeto;
      lanca.id_tarefa = this.trabalho.id_tarefa;
      lanca.id_trabalho = this.trabalho.id_trabalho;
      lanca.id_resp = this.trabalho.id_resp;
      lanca.id_exec = this.trabalho.id_exec;
      lanca.inicial = DataYYYYMMDDTHHMMSSZ(dtLanca1);
      lanca.final = DataYYYYMMDDTHHMMSSZ(dtLanca2);
      lanca.horasapon = minutostostohorasexagenal(
        DifHoras(lanca.inicial, lanca.final)
      );
      lanca.obs = dialogRetorno.tarde_obs;
      lanca.encerra = 'N';
      lanca.user_insert = 1;
      lanca.user_update = 0;
      const param: ResqPlanejamento = new ResqPlanejamento();
      param.acao = 'I';
      param.lanca = lanca;
      params.push(param);

      //this.insertLancamento(lanca);
    }

    if (
      dialogRetorno.manha_estado != '2' &&
      dialogRetorno.manha_op == 'Planejado' &&
      value.manha_id_apo_planejamento != 0
    ) {
      const param: ResqPlanejamento = new ResqPlanejamento();
      param.acao = 'A';
      param.id_empresa = value.manha_id_empresa;
      param.id = value.manha_id_apo_planejamento;
      param.lanca.obs = dialogRetorno.manha_obs;

      console.log('Olha aqui ==> manha', param);
      params.push(param);
    }

    if (
      dialogRetorno.tarde_estado != '2' &&
      dialogRetorno.tarde_op == 'Planejado' &&
      value.tarde_id_apo_planejamento != 0
    ) {
      const param: ResqPlanejamento = new ResqPlanejamento();
      param.acao = 'A';
      param.id_empresa = value.tarde_id_empresa;
      param.id = value.tarde_id_apo_planejamento;
      param.lanca.obs = dialogRetorno.tarde_obs;
      params.push(param);
    }

    if (
      dialogRetorno.manha_estado != '2' &&
      dialogRetorno.manha_op == 'Vago' &&
      value.manha_id_apo_planejamento != 0
    ) {
      const param: ResqPlanejamento = new ResqPlanejamento();
      param.acao = 'D';
      (param.id_empresa = value.manha_id_empresa),
        (param.id = value.manha_id_apo_planejamento);
      params.push(param);
    }

    if (
      dialogRetorno.tarde_estado != '2' &&
      dialogRetorno.tarde_op == 'Vago' &&
      value.tarde_id_apo_planejamento != 0
    ) {
      const param: ResqPlanejamento = new ResqPlanejamento();
      param.acao = 'D';
      (param.id_empresa = value.tarde_id_empresa),
        (param.id = value.tarde_id_apo_planejamento);
      params.push(param);
    }

    console.log('Açoes:', params);

    if (params.length > 0) {
      this.acaoLancamento(params);
    }
  }

  deleteLancamento(dialogRetorno: DialogExcluir) {
    let params: ResqPlanejamento[] = [];

    if (dialogRetorno.manha_estado != '2' && dialogRetorno.manha_id != 0) {
      const param: ResqPlanejamento = new ResqPlanejamento();
      param.acao = 'D';
      param.id_empresa = dialogRetorno.id_empresa;
      param.id = dialogRetorno.manha_id;
      params.push(param);
    }

    if (dialogRetorno.tarde_estado != '2' && dialogRetorno.tarde_id != 0) {
      const param: ResqPlanejamento = new ResqPlanejamento();
      param.acao = 'D';
      param.id_empresa = dialogRetorno.id_empresa;
      param.id = dialogRetorno.tarde_id;
      params.push(param);
    }

    if (params.length > 0) {
      console.log('EXCLUSÃO=>', params);
      this.acaoLancamento(params);
    }
  }

  acaoLancamento(params: ResqPlanejamento[]) {
    this.inscricaoLanca = this.aponPlanejamentoService
      .postPlanejamento(params)
      .subscribe(
        (data: any) => {
          this.openSnackBar_OK(`${data.message}`, 'OK');
          this.getAgenda();
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Falha Na Ação Dos Lançamentos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getTipoAgenda(value: Dias_Planejados, manha: Boolean): string {
    if (manha) {
      if (value.manha == '0') return 'adjust';
      if (value.manha == '1') return 'mood';
      if (value.manha == '2') return 'warning';
    } else {
      if (value.tarde == '0') return 'adjust';
      if (value.tarde == '1') return 'mood';
      if (value.tarde == '2') return 'warning';
    }

    return '';
  }

  getClass(value: Dias_Planejados, manha: Boolean): string {
    if (manha) {
      if (value.manha == '0') return 'icon_agenda_green';
      if (value.manha == '1') return 'icon_agenda_blue';
      if (value.manha == '2') return 'icon_agenda_red';
    } else {
      if (value.tarde == '0') return 'icon_agenda_green';
      if (value.tarde == '1') return 'icon_agenda_blue';
      if (value.tarde == '2') return 'icon_agenda_red';
    }

    return '';
  }
}
