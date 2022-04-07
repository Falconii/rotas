import { MotivoApoService } from './../../../services/motivo-apo.service';
import { MotivoApoModel } from './../../../Models/motivo-apo-model';
import { Component, OnInit } from '@angular/core';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-motivo-apo-view',
  templateUrl: './motivo-apo-view.component.html',
  styleUrls: ['./motivo-apo-view.component.css'],
})
export class MotivoApoViewComponent implements OnInit {
  formulario: FormGroup;

  motivo: MotivoApoModel = new MotivoApoModel();

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  ReadOnlyKey: boolean = false;

  inscricaoGet!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;

  durationInSeconds = 2;

  labelCadastro: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private motivoApoService: MotivoApoService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      codigo: ['', [Validators.required]],
      motivo: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      produtivo: [{ value: 'N' }, [Validators.required]],
    });
    this.motivo = new MotivoApoModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.motivo.id_empresa = params.id_empresa;
      this.motivo.codigo = params.codigo;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
  }

  ngOnInit(): void {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      this.motivo = new MotivoApoModel();
      this.motivo.id_empresa = 1;
      this.motivo.produtivo = 'N';
    } else {
      this.getMotivo();
    }

    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGet?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  onSubmit() {
    console.log('this.formulario', this.formulario);
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.openSnackBar_OK(`Formulário Com Campos Inválidos.`, 'OK');
    }
  }

  setValue() {
    this.formulario.setValue({
      codigo: this.motivo.codigo,
      motivo: this.motivo.motivo,
      produtivo: this.motivo.produtivo,
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
    this.router.navigate(['/motapos']);
  }

  getMotivo() {
    this.inscricaoGet = this.motivoApoService
      .getMotivoApo(this.motivo.id_empresa, this.motivo.codigo)
      .subscribe(
        (data: MotivoApoModel) => {
          this.motivo = data;
          this.setValue();
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa Nos Motivos De Apontamento ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Mot. Apontamento - Inclusão.';
        this.readOnly = false;
        this.ReadOnlyKey = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Mot. Apontamento - Alteração.';
        this.readOnly = false;
        this.ReadOnlyKey = true;

        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Mot. Apontamento - Consulta.';
        this.readOnly = true;
        this.ReadOnlyKey = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Mot. Apontamento - Exclusão.';
        this.readOnly = true;
        this.ReadOnlyKey = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.motivo.codigo = this.formulario.value.codigo;
    this.motivo.motivo = this.formulario.value.motivo;
    this.motivo.produtivo = this.formulario.value.produtivo;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.motivoApoService
          .MotivoApoInsert(this.motivo)
          .subscribe(
            async (data: MotivoApoModel) => {
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
        this.inscricaoAcao = this.motivoApoService
          .MotivoApoUpdate(this.motivo)
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
        this.inscricaoAcao = this.motivoApoService
          .MotivoApoDelete(this.motivo.id_empresa, this.motivo.codigo)
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
