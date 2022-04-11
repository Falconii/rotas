import { MensagensBotoes } from 'src/app/shared/util';
import { ParametroGruuser01 } from './../../parametros/parametro-gruuser-01';
import { GrupoUserService } from './../../services/grupo-user.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GruUserModel } from 'src/app/Models/gru-user-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';

@Component({
  selector: 'app-crud-grupo-user',
  templateUrl: './crud-grupo-user.component.html',
  styleUrls: ['./crud-grupo-user.component.css'],
})
export class CrudGrupoUserComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;

  grupos: GruUserModel[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Grupo'];

  opcoesCampo = ['Código', 'Grupo'];

  constructor(
    private formBuilder: FormBuilder,
    private grupoUserService: GrupoUserService,
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

  escolha(opcao: number, grupo?: GruUserModel) {
    if (typeof grupo !== 'undefined') {
      this.router.navigate(['/gruuser', grupo.id_empresa, grupo.id, opcao]);
    } else {
      this.router.navigate(['/gruuser', 1, 0, opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getGrupos() {
    let par = new ParametroGruuser01();

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
    if (this.parametros.value.campo == 'Grupo')
      par.grupo = this.parametros.value.filtro.toUpperCase();

    par.orderby = this.parametros.value.ordenacao;

    this.inscricaoGetFiltro = this.grupoUserService
      .getGrupoUsers_01(par)
      .subscribe(
        (data: GruUserModel[]) => {
          this.grupos = data;
        },
        (error: any) => {
          this.grupos = [];
          this.openSnackBar_Err(
            `Pesquisa Nos Grupos de Usuários ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
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
