import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/Models/usuario-model';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-atualizacao-cadastral',
  templateUrl: './atualizacao-cadastral.component.html',
  styleUrls: ['./atualizacao-cadastral.component.css'],
})
export class AtualizacaoCadastralComponent implements OnInit {
  usuario: UsuarioModel = new UsuarioModel();
  erro: any;
  idAcao: number = 5;
  inscricaoRota!: Subscription;
  incricaoGetUsuario!: Subscription;
  durationInSeconds = 2;

  constructor(
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.usuario.id_empresa = params.id_empresa;
      this.usuario.email = params.email;
    });
  }

  ngOnInit(): void {
    this.getUsuario();
  }

  ngOnDestroy(): void {
    this.incricaoGetUsuario?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
  }

  getUsuario() {
    this.incricaoGetUsuario = this.usuariosService
      .getUsuarioByEmail(this.usuario.id_empresa, this.usuario.email)
      .subscribe(
        (data: UsuarioModel) => {
          this.usuario = data;
          this.router.navigate([
            '/usuario',
            this.usuario.id_empresa,
            this.usuario.id,
            this.idAcao,
          ]);
        },
        (error: any) => {
          this.openSnackBar_Err(
            `Pesquisa Nos Usuários ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
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
}
