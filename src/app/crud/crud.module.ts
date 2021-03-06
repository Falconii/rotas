import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudClienteComponent } from './crud-cliente/crud-cliente.component';
import { CrudEmpresaComponent } from './crud-empresa/crud-empresa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { NgxMaskModule } from 'ngx-mask';
import { CrudUsuarioComponent } from './crud-usuario/crud-usuario.component';
import { CrudGrupoEcoComponent } from './crud-grupo-eco/crud-grupo-eco.component';
import { CrudGrupoUserComponent } from './crud-grupo-user/crud-grupo-user.component';
import { CrudMotivoApoComponent } from './crud-motivo-apo/crud-motivo-apo.component';
import { CrudProjetoComponent } from './crud-projeto/crud-projeto.component';
import { SharedModule } from '../shared/shared.module';
import { CrudEstruturaComponent } from './crud-estrutura/crud-estrutura.component';
import { CrudSubestruturaComponent } from './crud-subestrutura/crud-subestrutura.component';
import { TreeEstruturaComponent } from './crud-estrutura/tree-estrutura/tree-estrutura.component';
import { CrudAtividadeProjetoComponent } from './crud-atividade-projeto/crud-atividade-projeto.component';
import { CrudPlanejamentoLancamentoComponent } from './crud-planejamento-lancamento/crud-planejamento-lancamento.component';
import { CrudExecucaoLancamentoComponent } from './crud-execucao-lancamento/crud-execucao-lancamento.component';
import { CrudCondicaoComponent } from './crud-condicao/crud-condicao.component';
import { AtualizacaoCadastralComponent } from './crud-usuario/atualizacao-cadastral/atualizacao-cadastral.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
  declarations: [
    CrudClienteComponent,
    CrudEmpresaComponent,
    CrudUsuarioComponent,
    CrudGrupoEcoComponent,
    CrudGrupoUserComponent,
    CrudMotivoApoComponent,
    CrudMotivoApoComponent,
    CrudProjetoComponent,
    CrudEstruturaComponent,
    CrudSubestruturaComponent,
    TreeEstruturaComponent,
    CrudAtividadeProjetoComponent,
    CrudPlanejamentoLancamentoComponent,
    CrudExecucaoLancamentoComponent,
    CrudCondicaoComponent,
    AtualizacaoCadastralComponent,
  ],
  exports: [
    CrudClienteComponent,
    CrudEmpresaComponent,
    CrudUsuarioComponent,
    CrudGrupoEcoComponent,
    CrudGrupoUserComponent,
    CrudMotivoApoComponent,
    CrudEstruturaComponent,
    CrudCondicaoComponent,
  ],
})
export class CrudModule {}
