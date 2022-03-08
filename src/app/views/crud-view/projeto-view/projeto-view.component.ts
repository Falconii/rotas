import { ClientesService } from 'src/app/services/clientes.service';
import { ParametroCliente01 } from './../../../parametros/parametro-cliente-01';
import { ParametroUsuario01 } from './../../../parametros/parametro-usuario-01';
import { UsuariosService } from './../../../services/usuarios.service';
import { ClientesQuery01Model } from './../../../Models/cliente-query_01-model';
import { UsuarioQuery01Model } from './../../../Models/usuario-query_01-model';
import { ProjetosService } from './../../../services/projetos.service';
import { ProjetoModel } from './../../../Models/projeto-model';
import { Component, OnInit } from '@angular/core';
import { CadastroAcoes } from 'src/app/shared/cadastro-acoes';
import { Subscription, Subscriber } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-projeto-view',
  templateUrl: './projeto-view.component.html',
  styleUrls: ['./projeto-view.component.css'],
})
export class ProjetoViewComponent implements OnInit {
  formulario: FormGroup;

  projeto: ProjetoModel = new ProjetoModel();

  diretores: UsuarioQuery01Model[] = [];

  clientes: ClientesQuery01Model[] = [];

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGet!: Subscription;
  inscricaoGetGrupo!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoGetDiretor!: Subscription;
  inscricaoGetClientes!: Subscription;

  durationInSeconds = 2;

  labelCadastro: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private projetosService: ProjetosService,
    private usuariosService: UsuariosService,
    private clientesService: ClientesService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      descricao: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      id_diretor: [],
      diretor_razao: [],
      id_cliente: [],
      cliente_razao: [],
      dataprop: [],
      dataproj: [],
      dataenc: [],
      horasve: [],
      horasplan: [],
      horasexec: [],
      status: [],
    });
    this.projeto = new ProjetoModel();

    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.projeto.id_empresa = params.id_empresa;
      this.projeto.id = params.id;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
      this.load();
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
      this.projeto = new ProjetoModel();
      this.projeto.id_empresa = 1;
      this.setValue();
    } else {
      this.getProjeto();
    }
  }

  ngOnDestroy(): void {
    this.inscricaoGet?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoGetDiretor?.unsubscribe();
    this.inscricaoGetClientes?.unsubscribe();
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
    this.router.navigate(['/projetos']);
  }

  getProjeto() {
    this.inscricaoGet = this.projetosService
      .getProjeto(this.projeto.id_empresa, this.projeto.id)
      .subscribe(
        (data: ProjetoModel) => {
          this.projeto = data;
          console.log('Retorno', this.projeto, data);
          this.setValue();
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa No Cadastro De Projetos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
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

  setValue() {
    console.log('this.projeto-tela', this.projeto);
    this.formulario.setValue({
      id: this.projeto.id,
      descricao: this.projeto.descricao,
      id_diretor: this.projeto.id_diretor,
      diretor_razao:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.projeto.diretor_razao
          : '',
      id_cliente: this.projeto.id_cliente,
      cliente_razao:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.projeto.cliente_razao
          : '',
      dataprop: this.projeto.dataprop,
      dataproj: this.projeto.dataproj,
      dataenc: this.projeto.dataenc,
      horasve: this.projeto.horasve,
      horasplan: this.projeto.horasplan,
      horasexec: this.projeto.horasexec,
      status: this.projeto.status,
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
        this.labelCadastro = 'Projetos - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Projetos - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Projetos - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Projetos - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.projeto.descricao = this.formulario.value.descricao;
    this.projeto.id_diretor = this.formulario.value.id_diretor;
    this.projeto.id_cliente = this.formulario.value.id_cliente;
    this.projeto.dataprop = this.formulario.value.dataprop;
    this.projeto.dataproj = this.formulario.value.dataproj;
    this.projeto.dataenc = this.formulario.value.dataenc;
    this.projeto.horasve = this.formulario.value.horasve;
    this.projeto.horasplan = this.formulario.value.horasplan;
    this.projeto.horasexec = this.formulario.value.horasexec;
    this.projeto.user_insert = 1;
    this.projeto.user_update = 0;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.inscricaoAcao = this.projetosService
          .ProjetoInsert(this.projeto)
          .subscribe(
            async (data: ProjetoModel) => {
              await this.openSnackBar_OK(
                `Projeto Cadastrado No Código: ${data.id}`,
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
        this.inscricaoAcao = this.projetosService
          .ProjetoUpdate(this.projeto)
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
        this.inscricaoAcao = this.projetosService
          .ProjetoDelete(this.projeto.id_empresa, this.projeto.id)
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

  load() {
    //Diretoria
    let par = new ParametroUsuario01();

    par.id_empresa = 1;

    par.grupo = 4;

    par.orderby = 'Grupo';

    this.inscricaoGetDiretor = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: UsuarioQuery01Model[]) => {
          this.diretores = data;
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa Nos Usuários ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );

    //Clientes
    let par2 = new ParametroCliente01();

    par2.id_empresa = 1;

    par2.orderby = 'Razão';

    this.inscricaoGetClientes = this.clientesService
      .getClientes_01(par2)
      .subscribe(
        (data: ClientesQuery01Model[]) => {
          this.clientes = data;
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa Nos Clientes ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }
}
