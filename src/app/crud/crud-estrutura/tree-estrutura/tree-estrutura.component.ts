import { EstruturaModel } from 'src/app/Models/estrutura-model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subscriber } from 'rxjs';
import { EstruturasService } from './../../../services/estruturas.service';
import { Component, OnInit } from '@angular/core';
import { ParametroEstrutura01 } from 'src/app/parametros/parametro-estrutura01';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tree-estrutura',
  templateUrl: './tree-estrutura.component.html',
  styleUrls: ['./tree-estrutura.component.css'],
})
export class TreeEstruturaComponent implements OnInit {
  inscricaoRota!: Subscription;
  inscricaoGetFiltro!: Subscription;

  id_empresa: number = 0;
  conta: string = '';
  subconta: string = '';
  descricao: string = '';
  nivel: number = 0;

  estruturas: EstruturaModel[] = [];

  constructor(
    private estruturaService: EstruturasService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.inscricaoRota = this.route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.conta = params.conta;
      this.subconta = params.subconta;
      this.descricao = params.descricao;
      this.nivel = params.nivel;
    });
  }

  ngOnInit(): void {
    this.getEstruturas();
  }

  ngOnDestroy(): void {
    this.inscricaoRota?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
  }

  getEstruturas() {
    let par = new ParametroEstrutura01();

    par.id_empresa = this.id_empresa;

    par.conta = this.conta;

    par.orderby = 'Conta';

    this.inscricaoGetFiltro = this.estruturaService
      .getEstruturas(par)
      .subscribe(
        (data: EstruturaModel[]) => {
          this.estruturas = data;
          console.log(this.estruturas);
        },
        (error: any) => {
          this.estruturas = [];
          this.openSnackBar_Err(
            `Pesquisa Nas Estruturas ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  openSnackBar_Err(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getSpace(nivel: number): string {
    let retorno: string = '&nbsp;'.repeat(8 - nivel);
    return retorno;
  }

  onRetorno() {
    this.router.navigate(['/estruturas']);
  }
}
