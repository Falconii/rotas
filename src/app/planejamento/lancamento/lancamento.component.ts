import { ParametroTrabalhoProjeto01 } from './../../parametros/parametro-trabalho-projeto01';
import { TrabalhoProjetoService } from './../../services/trabalho-projeto.service';
import { TrabalhoProjetoModel } from './../../Models/trabalho-projeto-model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiasUteis, formatarData } from 'src/app/shared/util';

@Component({
  selector: 'app-lancamento',
  templateUrl: './lancamento.component.html',
  styleUrls: ['./lancamento.component.css'],
})
export class LancamentoComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetTrabalho!: Subscription;
  inscricaoRota!: Subscription;

  trabalho: TrabalhoProjetoModel = new TrabalhoProjetoModel();

  erro: string = '';

  durationInSeconds = 3;

  nro_dias = 0;

  constructor(
    private TrabalhoProjetoService: TrabalhoProjetoService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.trabalho.id_empresa = params.id_empresa;
      this.trabalho.id = params.id;
    });
    this.getTrabalho();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetTrabalho?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
  }

  getTrabalho() {
    let par = new ParametroTrabalhoProjeto01();

    par.id_empresa = this.trabalho.id_empresa;

    par.id = this.trabalho.id;

    this.inscricaoGetTrabalho =
      this.TrabalhoProjetoService.getTrabalhosProjetos_01(par).subscribe(
        (data: TrabalhoProjetoModel[]) => {
          this.trabalho = data[0];
          console.log(
            'DiasUteis',
            DiasUteis(
              formatarData(this.trabalho.inicial),
              formatarData(this.trabalho.final)
            )
          );
        },
        (error: any) => {
          this.trabalho = new TrabalhoProjetoModel();
          this.openSnackBar_Err(
            `Pesquisa TRabalhos Projetos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  openSnackBar_Err(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onRetorno() {
    this.router.navigate([
      '/trabalhosprojetosmanu',
      this.trabalho.id_empresa,
      this.trabalho.id_projeto,
    ]);
  }
}
