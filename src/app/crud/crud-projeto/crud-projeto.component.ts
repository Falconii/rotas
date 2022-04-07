import { ProjetosService } from './../../services/projetos.service';
import { ParametroProjeto01 } from './../../parametros/parametro-projeto01';
import { ProjetoModel } from './../../Models/projeto-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { MensagensBotoes } from 'src/app/shared/util';

@Component({
  selector: 'app-crud-projeto',
  templateUrl: './crud-projeto.component.html',
  styleUrls: ['./crud-projeto.component.css'],
})
export class CrudProjetoComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoGetGrupo!: Subscription;

  durationInSeconds: number = 3;

  id_empresa: number = 1;

  projetos: ProjetoModel[] = [];

  parametros: FormGroup;

  inclusao: ProjetoModel;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Descricao'];

  opcoesCampo = ['Código', 'Descrição'];

  constructor(
    private formBuilder: FormBuilder,
    private projetosServices: ProjetosService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.parametros = formBuilder.group({
      ordenacao: [null],
      campo: [null],
      filtro: [null],
      grupo: [],
    });
    this.inclusao = new ProjetoModel();
    this.inclusao.id_empresa = 1;
    this.inclusao.user_insert = 1;
    this.inclusao.user_update = 0;
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

  escolha(projeto: ProjetoModel, opcao: number) {
    if (opcao == 99) {
      this.router.navigate([
        '/anexaratividade',
        projeto.id_empresa,
        projeto.id,
      ]);
    } else {
      this.router.navigate(['/projeto', projeto.id_empresa, projeto.id, opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getProjetos() {
    let par = new ParametroProjeto01();

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

    this.inscricaoGetFiltro = this.projetosServices
      .getProjetos_01(par)
      .subscribe(
        (data: ProjetoModel[]) => {
          this.projetos = data;
        },
        (error: any) => {
          if (error.error.message == 'Nehuma Informação Para Esta Consulta.') {
            let trab = new ProjetoModel();
            trab.id_empresa = 1;
            trab.id = 0;
            trab.user_insert = 1;
            this.projetos = [];
            this.projetos.push(trab);
            this.openSnackBar_OK(
              'Nenhuma Informação Encontrada Para Esta Consulta!',
              'OK'
            );
          } else {
            this.projetos = [];
            this.openSnackBar_Err(
              `Pesquisa Nos Projetos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
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
    await this.delay(this.durationInSeconds * 1000);
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
