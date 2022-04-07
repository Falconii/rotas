import { GrupoUserService } from 'src/app/services/grupo-user.service';
import { GruUserModel } from './../../../Models/gru-user-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gru-user-view',
  templateUrl: './gru-user-view.component.html',
  styleUrls: ['./gru-user-view.component.css'],
})
export class GruUserViewComponent implements OnInit {
  formulario: FormGroup;

  grupo: GruUserModel = new GruUserModel();

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetGrupo!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;

  durationInSeconds = 2;

  labelCadastro: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private grupoEconomicoService: GrupoUserService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      grupo: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
    });
    this.grupo = new GruUserModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.grupo.id_empresa = params.id_empresa;
      this.grupo.id = params.id;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
  }

  ngOnInit(): void {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      this.grupo = new GruUserModel();
      this.grupo.id_empresa = 1;
    } else {
      this.getGrupo();
    }

    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGetGrupo?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
    }
  }

  setValue() {
    this.formulario.setValue({
      id: this.grupo.id,
      grupo: this.grupo.grupo,
    });
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  onCancel() {
    this.router.navigate(['/gruusers']);
  }

  getGrupo() {
    this.inscricaoGetGrupo = this.grupoEconomicoService
      .getGrupoUser(this.grupo.id_empresa, this.grupo.id)
      .subscribe(
        (data: GruUserModel) => {
          this.grupo = data;
          this.setValue();
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa Nos Grupos De Usuários ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Grupos De Usuários - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Grupos De Usuários - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Grupos De Usuários - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Grupos De Usuários - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.grupo.grupo = this.formulario.value.grupo;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.grupoEconomicoService
          .GrupoUserInsert(this.grupo)
          .subscribe(
            async (data: GruUserModel) => {
              this.onCancel();
            },
            (error: any) => {
              this.openSnackBar_Err(
                `Erro Na INclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.inscricaoAcao = this.grupoEconomicoService
          .GrupoUserUpdate(this.grupo)
          .subscribe(
            async (data: any) => {
              this.onCancel();
            },
            (error: any) => {
              console.log('Error', error.error);
              this.openSnackBar_Err(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.inscricaoAcao = this.grupoEconomicoService
          .GrupoUserDelete(this.grupo.id_empresa, this.grupo.id)
          .subscribe(
            async (data: any) => {
              this.onCancel();
            },
            (error: any) => {
              this.openSnackBar_Err(
                `Erro Na Exclusao ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      default:
        break;
    }
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

  getAcoes() {
    return CadastroAcoes;
  }

  touchedOrDirty(campo: string): boolean {
    if (
      this.formulario.get(campo)?.touched ||
      this.formulario.get(campo)?.dirty
    ) {
      return true;
    }
    return false;
  }
}
