import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UsuarioModel } from 'src/app/Models/usuario-model';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  durationInSeconds = 2;

  usuario: UsuarioModel = new UsuarioModel();

  formulario: FormGroup;

  inscricaoLogin!: Subscription;

  constructor(
    private usuarioSrv: UsuariosService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private route: Router
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '' }],
      senha: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
    });
    this.setValues();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoLogin?.unsubscribe();
  }
  onSubmit() {
    UsuariosService.login.id_empresa = 1;
    UsuariosService.login.id = this.formulario.value.id;
    UsuariosService.login.senha = this.formulario.value.senha;

    this.getUsuario();
  }

  onCancel() {
    this.route.navigate(['']);
  }

  setValues() {
    this.formulario.setValue({
      id: UsuariosService.login.id,
      senha: '',
    });
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

  getUsuario() {
    this.inscricaoLogin = this.usuarioSrv
      .getUsuario(UsuariosService.login.id_empresa, UsuariosService.login.id)
      .subscribe(
        (data: UsuarioModel) => {
          if (data.senha == UsuariosService.login.senha) {
            UsuariosService.login = data;
            this.openSnackBar_OK(`Usuário Logado Com Sucesso`, 'OK');
          } else {
            this.openSnackBar_Err(`Falha No Login!`, 'OK');
          }
        },
        (erros: any) => {
          this.openSnackBar_Err(`Falha No Login!`, 'OK');
        }
      );
  }
}
