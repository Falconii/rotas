import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteViewComponent } from './cliente-view/cliente-view.component';
import { EmpresaViewComponent } from './empresa-view/empresa-view.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioViewComponent } from './usuario-view/usuario-view.component';
import { GruEcoViewComponent } from './gru-eco-view/gru-eco-view.component';
import { GruUserViewComponent } from './gru-user-view/gru-user-view.component';
import { MotivoApoViewComponent } from './motivo-apo-view/motivo-apo-view.component';
import { TarefaViewComponent } from './tarefa-view/tarefa-view.component';
import { ProjetoViewComponent } from './projeto-view/projeto-view.component';

@NgModule({
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  declarations: [
    ClienteViewComponent,
    EmpresaViewComponent,
    UsuarioViewComponent,
    GruEcoViewComponent,
    GruUserViewComponent,
    MotivoApoViewComponent,
    TarefaViewComponent,
    ProjetoViewComponent,
  ],
  exports: [
    ClienteViewComponent,
    EmpresaViewComponent,
    UsuarioViewComponent,
    GruEcoViewComponent,
    GruUserViewComponent,
  ],
})
export class CrudViewModule {}
