import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudClienteComponent } from './crud-cliente/crud-cliente.component';
import { CrudEmpresaComponent } from './crud-empresa/crud-empresa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { CrudUsuarioComponent } from './crud-usuario/crud-usuario.component';
import { CrudGrupoEcoComponent } from './crud-grupo-eco/crud-grupo-eco.component';
import { CrudGrupoUserComponent } from './crud-grupo-user/crud-grupo-user.component';
import { CrudMotivoApoComponent } from './crud-motivo-apo/crud-motivo-apo.component';
import { CrudTarefaComponent } from './crud-tarefa/crud-tarefa.component';
import { CrudProjetoComponent } from './crud-projeto/crud-projeto.component';
import { CrudTrabalhosComponent } from './crud-trabalhos/crud-trabalhos.component';
import { CrudTarefasProjetosComponent } from './crud-tarefas-projetos/crud-tarefas-projetos.component';
import { SharedModule } from '../shared/shared.module';
import { CrudTrabalhoProjetoComponent } from './crud-trabalho-projeto/crud-trabalho-projeto.component';
import { CrudTrabalhosProjetosComponent } from './crud-trabalhos-projetos/crud-trabalhos-projetos.component';
import { CrudEstruturaComponent } from './crud-estrutura/crud-estrutura.component';
import { CrudSubestruturaComponent } from './crud-subestrutura/crud-subestrutura.component';
import { TreeEstruturaComponent } from './crud-estrutura/tree-estrutura/tree-estrutura.component';
import { CrudAtividadeProjetoComponent } from './crud-atividade-projeto/crud-atividade-projeto.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    CrudClienteComponent,
    CrudEmpresaComponent,
    CrudUsuarioComponent,
    CrudGrupoEcoComponent,
    CrudGrupoUserComponent,
    CrudMotivoApoComponent,
    CrudMotivoApoComponent,
    CrudTarefaComponent,
    CrudTarefaComponent,
    CrudProjetoComponent,
    CrudTrabalhosComponent,
    CrudTarefasProjetosComponent,
    CrudTrabalhoProjetoComponent,
    CrudTrabalhosProjetosComponent,
    CrudEstruturaComponent,
    CrudSubestruturaComponent,
    TreeEstruturaComponent,
    CrudAtividadeProjetoComponent,
  ],
  exports: [
    CrudClienteComponent,
    CrudEmpresaComponent,
    CrudUsuarioComponent,
    CrudGrupoEcoComponent,
    CrudGrupoUserComponent,
    CrudMotivoApoComponent,
    CrudTarefaComponent,
    CrudEstruturaComponent,
  ],
})
export class CrudModule {}
