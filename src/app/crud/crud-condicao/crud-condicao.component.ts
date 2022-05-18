import { CondicaoService } from './../../services/condicao.service';
import { CondicoesPagtoModel } from './../../Models/condicoes_pagtoModel';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { ParametroCondicao01 } from 'src/app/parametros/parametro-condicao01';
import { MensagensBotoes } from 'src/app/shared/util';

@Component({
  selector: 'app-crud-condicao',
  templateUrl: './crud-condicao.component.html',
  styleUrls: ['./crud-condicao.component.css'],
})
export class CrudCondicaoComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;

  condicoes: CondicoesPagtoModel[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Descrição'];

  opcoesCampo = ['Código', 'Descrição'];

  constructor(
    private formBuilder: FormBuilder,
    private condicaoService: CondicaoService,
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
    this.getCondicoes();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
  }

  escolha(opcao: number, cond?: CondicoesPagtoModel) {
    if (typeof cond !== 'undefined') {
      this.router.navigate(['/condicao', cond.id_empresa, cond.id, opcao]);
    } else {
      this.router.navigate(['/condicao', 1, 0, opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getCondicoes() {
    let par = new ParametroCondicao01();

    par.id_empresa = 1;

    if (this.parametros.value.campo == 'Código') {
      let key = parseInt(this.parametros.value.filtro, 10);

      console.log('key', key);

      if (isNaN(key)) {
        par.id = 0;
      } else {
        par.id = key;
      }
    }
    if (this.parametros.value.campo == 'Descrição')
      par.descricao = this.parametros.value.filtro.toUpperCase();

    par.orderby = this.parametros.value.ordenacao;

    this.inscricaoGetFiltro = this.condicaoService
      .getCondicoes_01(par)
      .subscribe(
        (data: CondicoesPagtoModel[]) => {
          this.condicoes = data;
        },
        (error: any) => {
          this.condicoes = [];
          this.openSnackBar_Err(
            `Pesquisa Em Cond. Pagto ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
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
      ordenacao: 'Código',
      campo: 'Código',
      filtro: '',
    });
  }

  getTexto() {
    return MensagensBotoes;
  }
}
