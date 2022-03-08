import { MensagensBotoes } from 'src/app/shared/util';
import { ParametroTarefa01 } from './../../parametros/parametro-tarefa01';
import { TarefasService } from 'src/app/services/tarefas.service';
import { TarefaModel } from 'src/app/Models/tarefa-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';

@Component({
  selector: 'app-crud-tarefa',
  templateUrl: './crud-tarefa.component.html',
  styleUrls: ['./crud-tarefa.component.css'],
})
export class CrudTarefaComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;

  tarefas: TarefaModel[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Descrição'];

  opcoesCampo = ['Código', 'Descrição'];

  constructor(
    private formBuilder: FormBuilder,
    private tarefasService: TarefasService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.parametros = formBuilder.group({
      ordenacao: [null],
      campo: [null],
      filtro: [null],
    });
    this.setValues();
  }

  ngOnInit(): void {
    this.getTarefas();
  }

  setValues() {
    this.parametros.setValue({
      ordenacao: 'Código',
      campo: 'Código',
      filtro: '',
    });
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
  }

  escolha(tarefa: TarefaModel, opcao: number) {
    if (opcao == 99) {
      this.router.navigate([
        '/trabalhos',
        tarefa.id_empresa,
        tarefa.codigo,
        tarefa.descricao,
      ]);
    } else {
      this.router.navigate([
        '/tarefa',
        tarefa.id_empresa,
        tarefa.codigo,
        opcao,
      ]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getTarefas() {
    let par = new ParametroTarefa01();

    par.id_empresa = 1;

    if (this.parametros.value.campo == 'Código')
      par.codigo = this.parametros.value.filtro.toUpperCase();

    if (this.parametros.value.campo == 'Descrição')
      par.descricao = this.parametros.value.filtro.toUpperCase();

    par.tarefa = 'S';

    par.trabalho = 'N';

    par.orderby = this.parametros.value.ordenacao;

    this.inscricaoGetFiltro = this.tarefasService.getTarefas_01(par).subscribe(
      (data: TarefaModel[]) => {
        this.tarefas = data;
      },
      (error: any) => {
        this.tarefas = [];
        this.openSnackBar_Err(
          `Pesquisa Nas tarefas ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
          'OK'
        );
      }
    );
  }

  openSnackBar_Err(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getTexto() {
    return MensagensBotoes;
  }
}
