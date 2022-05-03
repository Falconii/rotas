import { ControlePaginas } from './../../shared/controle-paginas';
import { MensagensBotoes } from 'src/app/shared/util';
import { GrupoEconomicoService } from './../../services/grupo-economico.service';
import { ClientesService } from './../../services/clientes.service';
import { ParametroCliente01 } from './../../parametros/parametro-cliente-01';
import { CadastroAcoes } from './../../shared/cadastro-acoes';
import { GrupoEcoModel } from './../../Models/gru-eco-models';
import { ClientesQuery01Model } from './../../Models/cliente-query_01-model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-crud-cliente',
  templateUrl: './crud-cliente.component.html',
  styleUrls: ['./crud-cliente.component.css'],
})
export class CrudClienteComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoGetGrupo!: Subscription;

  clientes: ClientesQuery01Model[] = [];

  grupos: GrupoEcoModel[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Razão', 'Grupo'];

  opcoesCampo = ['Código', 'Razão', 'Grupo'];

  tamPagina = 50;

  controlePaginas: ControlePaginas = new ControlePaginas(this.tamPagina, 0);

  constructor(
    private formBuilder: FormBuilder,
    private clientesServices: ClientesService,
    private grupoEconomicoService: GrupoEconomicoService,
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
    this.getClientesContador();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoGetGrupo?.unsubscribe();
  }

  escolha(opcao: number, cliente?: ClientesQuery01Model) {
    if (typeof cliente !== 'undefined') {
      this.router.navigate(['/cliente', cliente.id_empresa, cliente.id, opcao]);
    } else {
      this.router.navigate(['/cliente', 1, 0, opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getClientes() {
    let par = new ParametroCliente01();

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
    if (this.parametros.value.campo == 'Grupo')
      par.grupo = this.parametros.value.grupo;

    par.orderby = this.parametros.value.ordenacao;

    par.contador = 'N';

    par.pagina = this.controlePaginas.getPaginalAtual();

    this.inscricaoGetFiltro = this.clientesServices
      .getClientes_01(par)
      .subscribe(
        (data: ClientesQuery01Model[]) => {
          this.clientes = data;
        },
        (error: any) => {
          this.clientes = [];
          this.openSnackBar_Err(
            `Pesquisa Nos Clientes ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getClientesContador() {
    let par = new ParametroCliente01();

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
    if (this.parametros.value.campo == 'Grupo')
      par.grupo = this.parametros.value.grupo;

    par.orderby = this.parametros.value.ordenacao;

    par.contador = 'S';

    this.inscricaoGetFiltro = this.clientesServices
      .getClientes_01_C(par)
      .subscribe(
        (data: any) => {
          this.controlePaginas = new ControlePaginas(
            this.tamPagina,
            data.total
          );
          this.getClientes();
        },
        (error: any) => {
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
          this.openSnackBar_Err(
            `Pesquisa Nos Clientes ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  openSnackBar_Err(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getGrupos() {
    this.inscricaoGetGrupo = this.grupoEconomicoService
      .getGrupoEcos()
      .subscribe(
        (data: GrupoEcoModel[]) => {
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

  onChangePage() {
    this.getClientes();
  }
}
