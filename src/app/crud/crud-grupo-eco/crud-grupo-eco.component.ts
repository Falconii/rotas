import { MensagensBotoes } from 'src/app/shared/util';
import { GrupoEconomicoService } from './../../services/grupo-economico.service';
import { GrupoEcoModel } from './../../Models/gru-eco-models';
import { ClientesQuery01Model } from './../../Models/cliente-query_01-model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParametroGrupoEco01 } from 'src/app/parametros/parametro-grupo-eco01';

@Component({
  selector: 'app-crud-grupo-eco',
  templateUrl: './crud-grupo-eco.component.html',
  styleUrls: ['./crud-grupo-eco.component.css'],
})
export class CrudGrupoEcoComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;

  grupos: GrupoEcoModel[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Razão'];

  opcoesCampo = ['Código', 'Razão'];

  constructor(
    private formBuilder: FormBuilder,
    private grupoEconomicoService: GrupoEconomicoService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.parametros = formBuilder.group({
      ordenacao: [null],
      campo: [null],
      filtro: [null],
    });
    this.setValues();
    this.getGrupos();
  }

  ngOnInit(): void {
    this.getGrupos();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
  }

  escolha(opcao: number, grupo?: GrupoEcoModel) {
    if (typeof grupo !== 'undefined') {
      this.router.navigate(['/grueco', grupo.id_empresa, grupo.id, opcao]);
    } else {
      this.router.navigate(['/grueco', 1, 0, opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getGrupos() {
    let par = new ParametroGrupoEco01();

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
    if (this.parametros.value.campo == 'Razão')
      par.razao = this.parametros.value.filtro.toUpperCase();

    par.orderby = this.parametros.value.ordenacao;

    this.inscricaoGetFiltro = this.grupoEconomicoService
      .getGrupoEcos_01(par)
      .subscribe(
        (data: GrupoEcoModel[]) => {
          this.grupos = data;
        },
        (error: any) => {
          this.grupos = [];
          this.openSnackBar_Err(
            `Pesquisa Nos Grupos Econômicos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
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
