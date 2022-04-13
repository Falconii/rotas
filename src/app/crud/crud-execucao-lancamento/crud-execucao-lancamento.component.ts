import { UsuarioModel } from './../../Models/usuario-model';
import { UsuariosService } from './../../services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApoExecucaoModel } from 'src/app/Models/apo-execucao-model';
import { AtividadeModel } from 'src/app/Models/atividade-model';
import { MoviData } from 'src/app/Models/movi-data';
import { ParametroAgendaPlanejamento03 } from 'src/app/parametros/parametro-agenda-planejamento03';
import { AponPlanejamentoService } from 'src/app/services/apon-planejamento.service';
import { AtividadesService } from 'src/app/services/atividades.service';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { MensagensBotoes } from 'src/app/shared/util';

@Component({
  selector: 'app-crud-execucao-lancamento',
  templateUrl: './crud-execucao-lancamento.component.html',
  styleUrls: ['./crud-execucao-lancamento.component.css'],
})
export class CrudExecucaoLancamentoComponent implements OnInit {
  durationInSeconds: number = 2;
  parametroAgendaPlanejamento03: ParametroAgendaPlanejamento03 =
    new ParametroAgendaPlanejamento03();
  agendamento: MoviData = new MoviData();
  inscricaoGetAll!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoUsuario!: Subscription;
  inscricaoApontamento!: Subscription;
  inscricaoAponAgendas!: Subscription;
  idAcao: number = 0;
  acao: string = '';
  labelCadastro: string = '';
  id_empresa: number = 0;
  id_atividade: number = 0;
  atividade: AtividadeModel = new AtividadeModel();
  apontamento: ApoExecucaoModel = new ApoExecucaoModel();
  dados_projetos: string = 'Olá';
  usuario: UsuarioModel = new UsuarioModel();
  filtro: Boolean = false;
  formulario: FormGroup;
  parametro: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private aponPlanejamentoService: AponPlanejamentoService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      entrada: [{ value: '' }],
      saida: [],
      obs: [{ value: '' }],
    });
    this.parametro = formBuilder.group({
      data: [{ value: '' }],
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
    this.inscricaoRota?.unsubscribe();
    this.inscricaoApontamento?.unsubscribe();
    this.inscricaoAponAgendas?.unsubscribe();
  }

  getUsuario() {
    this.inscricaoUsuario = this.usuariosService.getUsuario(1, 2).subscribe(
      (data: UsuarioModel) => {
        this.usuario = data;
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

  getRefresh(){

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
      obs: this.apontamento.obs,
    });
  }

  setParametro() {
    this.parametro.setValue({
      data: new Date(),
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

  async openSnackBar_OK(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
    await this.delay(this.durationInSeconds * 1000);
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
}
