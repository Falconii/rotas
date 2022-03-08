import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientesModel } from 'src/app/Models/cliente-model';
import { GrupoEcoModel } from 'src/app/Models/gru-eco-models';
import { ClientesService } from 'src/app/services/clientes.service';
import { GrupoEconomicoService } from 'src/app/services/grupo-economico.service';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';

@Component({
  selector: 'app-cliente-views',
  templateUrl: './cliente-views.component.html',
  styleUrls: ['./cliente-views.component.css'],
})
export class ClienteViewsComponent implements OnInit {
  formulario: FormGroup;

  cliente: ClientesModel;

  grupos: GrupoEcoModel[];

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetCliente!: Subscription;
  inscricaoGetGrupo!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;

  durationInSeconds = 2;

  labelCadastro: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private clientesServices: ClientesService,
    private grupoEconomicoService: GrupoEconomicoService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      razao: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(65),
        ],
      ],
      fantasi: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      gru_econo: [{ value: '' }],
      gru_econo_: [{ value: '' }],
    });
    this.cliente = new ClientesModel();
    this.grupos = [];
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.cliente.id_empresa = params.id_empresa;
      this.cliente.id = params.id;
      this.cliente.gru_econo = 1;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
  }

  async openSnackBar() {
    this._snackBar.openFromComponent(SnakBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
    await this.delay(this.durationInSeconds * 1000);
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
  ngOnInit() {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      this.cliente = new ClientesModel();
      this.cliente.id_empresa = 1;
      this.cliente.gru_econo = 1;
    } else {
      this.getCliente();
    }

    this.getGrupos();

    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGetCliente?.unsubscribe();
    this.inscricaoGetGrupo?.unsubscribe();
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

  onCancel() {
    this.router.navigate(['/clientes']);
  }

  getCliente() {
    this.inscricaoGetCliente = this.clientesServices
      .getCliente(this.cliente.id_empresa, this.cliente.id)
      .subscribe(
        (data: ClientesModel) => {
          this.cliente = data;
          this.setValue();
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa Nos Clientes ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  setReadOnly(value: Boolean) {
    /*
  Posso fazer na criação tb
  this.formGroupName = this.fb.group({
    xyz: [{ value: '', disabled: true }, Validators.required]
});
*/
    //this.formulario.get('grupo')?.disable({ onlySelf: true });
  }

  getGrupos() {
    if (
      this.idAcao == CadastroAcoes.Consulta ||
      this.idAcao == CadastroAcoes.Exclusao
    ) {
      console.log('Pesquisa Grupo - Cliente', this.cliente);
      this.inscricaoGetGrupo = this.grupoEconomicoService
        .getGrupoEco(this.cliente.id_empresa, this.cliente.gru_econo)
        .subscribe(
          (data: GrupoEcoModel) => {
            this.grupos.push(data);
          },
          (error: any) => {
            this.openSnackBar_Err(
              `Pesquisa Nos Grupos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
        );
    } else {
      this.inscricaoGetGrupo = this.grupoEconomicoService
        .getGrupoEcos()
        .subscribe(
          (data: GrupoEcoModel[]) => {
            this.grupos = data;
          },
          (error: any) => {
            this.openSnackBar_Err(
              `Pesquisa Nos Grupos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
        );
    }
  }

  setValue() {
    this.formulario.setValue({
      id: this.cliente.id,
      razao: this.cliente.razao,
      fantasi: this.cliente.fantasi,
      gru_econo: this.cliente.gru_econo,
      gru_econo_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.cliente.grupo
          : '',
    });
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Clientes - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Clientes - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Clientes - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Clientes - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.cliente.razao = this.formulario.value.razao;
    this.cliente.fantasi = this.formulario.value.fantasi;
    this.cliente.gru_econo = this.formulario.value.gru_econo;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.clientesServices
          .clienteInsert(this.cliente)
          .subscribe(
            async (data: ClientesModel) => {
              await this.openSnackBar_OK(
                `Cliente Cadastrado No Código: ${data.id}`,
                'OK'
              );
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
        this.inscricaoAcao = this.clientesServices
          .clienteUpdate(this.cliente)
          .subscribe(
            async (data: any) => {
              await this.openSnackBar_OK(data.message, 'OK');
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
        this.inscricaoAcao = this.clientesServices
          .clienteDelete(this.cliente.id_empresa, this.cliente.id)
          .subscribe(
            async (data: any) => {
              await this.openSnackBar_OK(data.message, 'OK');
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
    )
      return true;
    return false;
  }
}

@Component({
  selector: 'snack-bar-clientes',
  templateUrl: 'snack-bar-clientes.component.html',
  styles: [
    `
      .example-pizza-party {
        color: hotpink;
      }
    `,
  ],
})
export class SnakBarComponent {}
