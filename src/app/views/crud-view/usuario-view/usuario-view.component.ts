import { GrupoUserService } from 'src/app/services/grupo-user.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { GruUserModel } from './../../../Models/gru-user-model';
import { UsuarioModel } from 'src/app/Models/usuario-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { ValidatorCep } from 'src/app/shared/Validators/validator-cep';
import { ValidatorDate } from 'src/app/shared/Validators/validator-date';
import { ValidatorCnpjCpf } from 'src/app/shared/Validators/validator-Cnpj-Cpf';
import { EstadoModel } from 'src/app/Models/estado-model';
import { DropdownService } from 'src/app/shared/services/dropdown.service';

@Component({
  selector: 'app-usuario-view',
  templateUrl: './usuario-view.component.html',
  styleUrls: ['./usuario-view.component.css'],
})
export class UsuarioViewComponent implements OnInit {
  formulario: FormGroup;

  usuario: UsuarioModel = new UsuarioModel();

  grupos: GruUserModel[] = [];

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  incricaoGetUsuario!: Subscription;
  inscricaoGetGrupo!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoUf!: Subscription;

  durationInSeconds = 2;

  labelCadastro: string = '';

  ufs: EstadoModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private grupoUserService: GrupoUserService,
    private estadosSrv: DropdownService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      razao: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      cadastr: [{ value: '' }, [ValidatorDate(true)]],
      cnpj_cpf: [{ value: '' }, [ValidatorCnpjCpf(false)]],
      senha: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      grupo: [{ value: '' }],
      grupo_: [{ value: '' }],
      rua: [{ value: '' }, [ValidatorStringLen(3, 80, true)]],
      nro: [{ value: '' }, [ValidatorStringLen(1, 10, true)]],
      complemento: [{ value: '' }, [ValidatorStringLen(0, 30)]],
      bairro: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      cidade: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      uf: [{ value: '' }, [ValidatorStringLen(2, 2, true)]],
      uf_: [{ value: '' }],
      cep: [{ value: '' }, [ValidatorCep(true)]],
      tel1: [{ value: '' }, [ValidatorStringLen(0, 23, true)]],
      tel2: [{ value: '' }, [ValidatorStringLen(0, 23)]],
      email: [{ value: '' }, [Validators.required, Validators.email]],
    });
    this.usuario = new UsuarioModel();
    this.grupos = [];
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.usuario.id_empresa = params.id_empresa;
      this.usuario.id = params.id;
      this.usuario.senha = '';
      this.usuario.grupo = 1;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
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
      this.usuario = new UsuarioModel();
      this.usuario.id_empresa = 1;
      this.usuario.grupo = 1;
      this.setValue();
    } else {
      this.getUsuario();
    }

    this.getUfs();

    this.getGrupos();
  }

  ngOnDestroy(): void {
    this.incricaoGetUsuario?.unsubscribe();
    this.inscricaoGetGrupo?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoUf?.unsubscribe();
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
    if (this.idAcao == CadastroAcoes.Atualizacao) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/usuarios']);
    }
  }

  getUfs() {
    this.inscricaoUf = this.estadosSrv.getEstados().subscribe(
      (data: EstadoModel[]) => {
        this.ufs = data;
      },
      (error: any) => {
        this.openSnackBar_Err(
          `Pesquisa Cadastrado De Estados ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
          'OK'
        );
      }
    );
  }

  getUsuario() {
    this.incricaoGetUsuario = this.usuariosService
      .getUsuario(this.usuario.id_empresa, this.usuario.id)
      .subscribe(
        (data: UsuarioModel) => {
          this.usuario = data;
          this.setValue();
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa Nos Usuários ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
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
      /*
      this.inscricaoGetGrupo = this.grupoUserService
        .getGrupoUser(this.usuario.id_empresa, this.usuario.grupo)
        .subscribe(
          (data: GruUserModel) => {
            this.grupos.push(data);
          },
          (error: any) => {
            this.openSnackBar_Err(
              `Pesquisa Nos Grupos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
        );*/
    } else {
      this.inscricaoGetGrupo = this.grupoUserService.getGrupoUsers().subscribe(
        (data: GruUserModel[]) => {
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
    console.log('usuario', this.usuario);
    this.formulario.setValue({
      id: this.usuario.id,
      razao: this.usuario.razao,
      cadastr: this.usuario.cadastr,
      senha: this.usuario.senha,
      grupo: this.usuario.grupo,
      grupo_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.usuario.gru_descricao
          : '',
      cnpj_cpf: this.usuario.cnpj_cpf,
      rua: this.usuario.rua,
      nro: this.usuario.nro,
      complemento: this.usuario.complemento,
      bairro: this.usuario.bairro,
      cidade: this.usuario.cidade,
      uf: this.usuario.uf,
      uf_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.usuario.uf
          : '',
      cep: this.usuario.cep,
      tel1: this.usuario.tel1,
      tel2: this.usuario.tel2,
      email: this.usuario.email,
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
        this.labelCadastro = 'Usuários - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Usuários - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Usuários - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Usuários - Exclusão.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Atualizacao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Usuários - Atualização';
        this.readOnly = false;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.usuario.razao = this.formulario.value.razao;
    this.usuario.cnpj_cpf = this.formulario.value.cnpj_cpf;
    this.usuario.cadastr = this.formulario.value.cadastr;
    this.usuario.rua = this.formulario.value.rua;
    this.usuario.nro = this.formulario.value.nro;
    this.usuario.complemento = this.formulario.value.complemento;
    this.usuario.bairro = this.formulario.value.bairro;
    this.usuario.cidade = this.formulario.value.cidade;
    this.usuario.uf = this.formulario.value.uf;
    this.usuario.cep = this.formulario.value.cep;
    this.usuario.tel1 = this.formulario.value.tel1;
    this.usuario.tel2 = this.formulario.value.tel2;
    this.usuario.email = this.formulario.value.email;
    this.usuario.senha = this.formulario.value.senha;
    this.usuario.pasta = this.formulario.value.pasta;
    this.usuario.grupo = this.formulario.value.grupo;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.usuariosService
          .UsuarioInsert(this.usuario)
          .subscribe(
            async (data: UsuarioModel) => {
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
        this.inscricaoAcao = this.usuariosService
          .UsuarioUpdate(this.usuario)
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
      case CadastroAcoes.Atualizacao:
        this.inscricaoAcao = this.usuariosService
          .UsuarioUpdate(this.usuario)
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
        this.inscricaoAcao = this.usuariosService
          .UsuarioDelete(this.usuario.id_empresa, this.usuario.id)
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

  getValidfield(field: string): boolean {
    return (
      this.formulario.get(field)?.errors?.ValidatorStringLen &&
      this.touchedOrDirty(field)
    );
  }

  getMensafield(field: string): string {
    return this.formulario.get(field)?.errors?.message;
  }

  setEmailReadOnly() {
    if (this.idAcao == 5) {
      return true;
    }
    return this.readOnly;
  }
}
