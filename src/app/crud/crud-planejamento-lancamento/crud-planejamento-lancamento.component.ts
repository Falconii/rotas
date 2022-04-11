import { Movimento } from './../../Models/movimento';
import { AtividadeModel } from './../../Models/atividade-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParametroAtividade01 } from 'src/app/parametros/parametro-atividade01';
import { AtividadesService } from 'src/app/services/atividades.service';
import { MoviData } from 'src/app/Models/movi-data';
import { DataYYYYMMDD, DiasUteisV2 } from 'src/app/shared/util';

@Component({
  selector: 'app-crud-planejamento-lancamento',
  templateUrl: './crud-planejamento-lancamento.component.html',
  styleUrls: ['./crud-planejamento-lancamento.component.css'],
})
export class CrudPlanejamentoLancamentoComponent implements OnInit {
  agendamentos: MoviData[] = [];
  inscricaoGetAll!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAtividade!: Subscription;

  id_empresa: number = 0;
  id_atividade: number = 0;
  atividade: AtividadeModel = new AtividadeModel();

  formulario: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private atividadesService: AtividadesService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      entrada: [{ value: '' }],
      saida: [],
      obs: [{ value: '' }, [Validators.required, Validators.maxLength(50)]],
    });
    this.setValue();
    this.inscricaoRota = this.route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.id_atividade = params.id_atividade;
    });
    this.getAtividade();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAtividade?.unsubscribe();
  }
  setValue() {
    this.formulario.setValue({
      entrada: '00:00',
      saida: '00:00',
      obs: ' ',
    });
  }

  getAtividade() {
    this.inscricaoAtividade = this.atividadesService
      .getAtividade(this.id_empresa, this.id_atividade)
      .subscribe(
        (data: AtividadeModel) => {
          this.atividade = data;

          this.agendamentos = DiasUteisV2(
            DataYYYYMMDD(this.atividade.inicial),
            DataYYYYMMDD(this.atividade.final)
          );

          var lanca = new Movimento();
          lanca.id = 12;
          lanca.obs = 'OLÁ KKK';
          lanca.id_projeto = 100;
          lanca.id_exec = 2;
          this.agendamentos[1].movimentos.push(lanca);
          console.log('Agendamento:', this.agendamentos);
        },
        (error: any) => {
          this.atividade = new AtividadeModel();
          this.openSnackBar_Err(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  openSnackBar_Err(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onSubmit() {}

  onCancel() {}
}
