import { MensagensBotoes } from 'src/app/shared/util';
import { GruUserModel } from './../../Models/gru-user-model';
import { UsuarioQuery01Model } from './../../Models/usuario-query_01-model';
import { ParametroUsuario01 } from './../../parametros/parametro-usuario-01';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { GrupoEcoModel } from './../../Models/gru-eco-models';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GrupoUserService } from 'src/app/services/grupo-user.service';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';

@Component({
  selector: 'app-crud-usuario',
  templateUrl: './crud-usuario.component.html',
  styleUrls: ['./crud-usuario.component.css'],
})
export class CrudUsuarioComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoGetGrupo!: Subscription;

  usuarios: UsuarioQuery01Model[] = [];

  grupos: GruUserModel[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Razão', 'Grupo'];

  opcoesCampo = ['Código', 'Razão', 'Grupo'];

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private grupoUserService: GrupoUserService,
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
    this.getGrupos();
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoGetGrupo?.unsubscribe();
  }

  escolha(opcao: number, usuario?: UsuarioQuery01Model) {
    if (typeof usuario !== 'undefined') {
      this.router.navigate(['/usuario', usuario.id_empresa, usuario.id, opcao]);
    } else {
      this.router.navigate(['/usuario', 1, 0, opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getUsuarios() {
    let par = new ParametroUsuario01();

    par.id_empresa = 1;

    if (this.parametros.value.campo == 'Código') {
      let key = parseInt(this.parametros.value.filtro, 10);

      if (isNaN(key)) {
        par.id = 0;
      } else {
        par.id = key;
      }
    }
    if (this.parametros.value.campo == 'Razão')
      par.razao = this.parametros.value.filtro.toUpperCase();
    if (this.parametros.value.campo == 'Grupo')
      par.grupo = this.parametros.value.grupo;

    par.orderby = this.parametros.value.ordenacao;

    this.inscricaoGetFiltro = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: UsuarioQuery01Model[]) => {
          this.usuarios = data;
        },
        (error: any) => {
          this.usuarios = [];
          this.openSnackBar_Err(
            `Pesquisa Nos Usuários ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  openSnackBar_Err(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getGrupos() {
    this.inscricaoGetGrupo = this.grupoUserService.getGrupoUsers().subscribe(
      (data: GruUserModel[]) => {
        this.grupos = data;
      },
      (error: any) => {
        this.erro = error;
        this.grupos = [];
        console.log('this.erro', this.erro);
      }
    );
  }

  isGrupo(): Boolean {
    if (this.parametros.value.campo == 'Grupo') {
      return true;
    } else {
      return false;
    }
  }

  setValues() {
    this.parametros.setValue({
      ordenacao: 'Código',
      campo: 'Código',
      filtro: '',
      grupo: 1,
    });
  }

  getTexto() {
    return MensagensBotoes;
  }
}
