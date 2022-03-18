import { MensagensBotoes } from 'src/app/shared/util';
import { TarefaProjetoService } from './../../services/tarefa-projeto.service';
import { TrabalhoProjetoService } from './../../services/trabalho-projeto.service';
import { UsuariosService } from './../../services/usuarios.service';
import { TrabalhoProjetoModel } from './../../Models/trabalho-projeto-model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TarefaProjetoModel } from 'src/app/Models/tarefa-projeto-model';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParametroTarefaProjeto01 } from 'src/app/parametros/parametro-tarefa-projeto01';
import { ParametroTarefa01 } from 'src/app/parametros/parametro-tarefa01';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario-01';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';

@Component({
  selector: 'app-crud-trabalho-projeto',
  templateUrl: './crud-trabalho-projeto.component.html',
  styleUrls: ['./crud-trabalho-projeto.component.css'],
})
export class CrudTrabalhoProjetoComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoGetGrupo!: Subscription;

  tarefas_projetos: TarefaProjetoModel[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao = ['Projeto', 'Tarefa'];

  opcoesCampo = ['Projeto', 'Tarefa'];

  constructor(
    private formBuilder: FormBuilder,
    private tarefaProjetoService: TarefaProjetoService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.parametros = formBuilder.group({
      ordenacao: [null],
      campo: [null],
      filtro: [null],
      grupo: [],
    });
    this.setValues();
  }

  ngOnInit(): void {
    this.getProjetos();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoGetGrupo?.unsubscribe();
  }

  escolha(projeto: TarefaProjetoModel, opcao: number) {
    this.router.navigate([
      '/trabalhosprojetosmanu',
      projeto.id_empresa,
      projeto.id_projeto,
      projeto.id_tarefa,
    ]);
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getProjetos() {
    let par = new ParametroTarefaProjeto01();

    par.id_empresa = 1;

    if (this.parametros.value.campo == 'Projeto') {
      let key = parseInt(this.parametros.value.filtro, 10);

      console.log('key', key);

      if (isNaN(key)) {
        par.id_projeto;
      } else {
        par.id_projeto = key;
      }
    }

    if (this.parametros.value.campo == 'Tarefa')
      par.id_tarefa = this.parametros.value.filtro;

    par.orderby = this.parametros.value.ordenacao;

    this.inscricaoGetFiltro = this.tarefaProjetoService
      .getTarefasProjetos_01(par)
      .subscribe(
        (data: TarefaProjetoModel[]) => {
          this.tarefas_projetos = data;
        },
        (error: any) => {
          this.tarefas_projetos = [];
          this.openSnackBar_Err(
            `Pesquisa Nos Projetos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  openSnackBar_Err(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  setValues() {
    this.parametros.setValue({
      ordenacao: 'Projeto',
      campo: 'Projeto',
      filtro: '',
      grupo: 1,
    });
  }

  getTexto() {
    return MensagensBotoes;
  }
}
