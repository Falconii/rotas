import { MensagensBotoes } from 'src/app/shared/util';
import { ParametroEmpresa01 } from './../../parametros/parametro-empresa-01';
import { EmpresasService } from './../../services/empresas.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmpresaQuery01Model } from 'src/app/Models/empresa-query_01-model';
import { ParametroCliente01 } from 'src/app/parametros/parametro-cliente-01';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { ControlePaginas } from 'src/app/shared/controle-paginas';

@Component({
  selector: 'app-crud-empresa',
  templateUrl: './crud-empresa.component.html',
  styleUrls: ['./crud-empresa.component.css'],
})
export class CrudEmpresaComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;

  empresas: EmpresaQuery01Model[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Razão'];

  opcoesCampo = ['Código', 'Razão'];

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresasService,
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
    this.getEmpresas();
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

  escolha(opcao: number, empresa?: EmpresaQuery01Model) {
    if (typeof empresa !== 'undefined') {
      this.router.navigate(['/empresa', empresa?.id, opcao]);
    } else {
      this.router.navigate(['/empresa', 1, opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getEmpresas() {
    let par = new ParametroEmpresa01();

    par.id = 1;

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

    this.inscricaoGetFiltro = this.empresaService.getEmpresas_01(par).subscribe(
      (data: EmpresaQuery01Model[]) => {
        this.empresas = data;
      },
      (error: any) => {
        this.empresas = [];
        this.openSnackBar_Err(
          `Pesquisa Nas Empresas ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
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
