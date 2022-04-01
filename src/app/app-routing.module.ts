import { CrudTarefasProjetosComponent } from './crud/crud-tarefas-projetos/crud-tarefas-projetos.component';
import { CrudClienteComponent } from './crud/crud-cliente/crud-cliente.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudEmpresaComponent } from './crud/crud-empresa/crud-empresa.component';
import { EmpresaViewComponent } from './views/crud-view/empresa-view/empresa-view.component';
import { CrudUsuarioComponent } from './crud/crud-usuario/crud-usuario.component';
import { UsuarioViewComponent } from './views/crud-view/usuario-view/usuario-view.component';
import { CrudGrupoEcoComponent } from './crud/crud-grupo-eco/crud-grupo-eco.component';
import { CrudGrupoUserComponent } from './crud/crud-grupo-user/crud-grupo-user.component';
import { CrudMotivoApoComponent } from './crud/crud-motivo-apo/crud-motivo-apo.component';
import { ClienteViewComponent } from './views/crud-view/cliente-view/cliente-view.component';
import { GruEcoViewComponent } from './views/crud-view/gru-eco-view/gru-eco-view.component';
import { GruUserViewComponent } from './views/crud-view/gru-user-view/gru-user-view.component';
import { MotivoApoViewComponent } from './views/crud-view/motivo-apo-view/motivo-apo-view.component';
import { CrudTarefaComponent } from './crud/crud-tarefa/crud-tarefa.component';
import { TarefaViewComponent } from './views/crud-view/tarefa-view/tarefa-view.component';
import { CrudProjetoComponent } from './crud/crud-projeto/crud-projeto.component';
import { ProjetoViewComponent } from './views/crud-view/projeto-view/projeto-view.component';
import { CrudTrabalhosComponent } from './crud/crud-trabalhos/crud-trabalhos.component';
import { CrudTrabalhoProjetoComponent } from './crud/crud-trabalho-projeto/crud-trabalho-projeto.component';
import { CrudTrabalhosProjetosComponent } from './crud/crud-trabalhos-projetos/crud-trabalhos-projetos.component';
import { LancamentoComponent } from './planejamento/lancamento/lancamento.component';
import { CrudEstruturaComponent } from './crud/crud-estrutura/crud-estrutura.component';
import { CrudSubestruturaComponent } from './crud/crud-subestrutura/crud-subestrutura.component';
import { CrudViewEstruturaComponent } from './views/crud-view/crud-view-estrutura/crud-view-estrutura.component';
import { TreeEstruturaComponent } from './crud/crud-estrutura/tree-estrutura/tree-estrutura.component';

const routes: Routes = [
  { path: 'empresa/:id/:acao', component: EmpresaViewComponent },
  { path: 'empresas', component: CrudEmpresaComponent },
  { path: 'usuario/:id_empresa/:id/:acao', component: UsuarioViewComponent },
  { path: 'usuarios', component: CrudUsuarioComponent },
  { path: 'cliente/:id_empresa/:id/:acao', component: ClienteViewComponent },
  { path: 'clientes', component: CrudClienteComponent },
  { path: 'tarefa/:id_empresa/:codigo/:acao', component: TarefaViewComponent },
  { path: 'tarefas', component: CrudTarefaComponent },
  { path: 'grueco/:id_empresa/:id/:acao', component: GruEcoViewComponent },
  { path: 'gruecos', component: CrudGrupoEcoComponent },
  { path: 'gruuser/:id_empresa/:id/:acao', component: GruUserViewComponent },
  { path: 'gruusers', component: CrudGrupoUserComponent },
  { path: 'motapos', component: CrudMotivoApoComponent },
  {
    path: 'motivoapo/:id_empresa/:codigo/:acao',
    component: MotivoApoViewComponent,
  },
  { path: 'motivoapos', component: CrudUsuarioComponent },
  { path: 'projeto/:id_empresa/:id/:acao', component: ProjetoViewComponent },
  { path: 'projetos', component: CrudProjetoComponent },
  {
    path: 'trabalhos/:id_empresa/:tarefa/:descricao',
    component: CrudTrabalhosComponent,
  },
  {
    path: 'tarefasprojetos/:id_empresa/:projeto/:descricao',
    component: CrudTarefasProjetosComponent,
  },
  {
    path: 'trabalhosprojetos',
    component: CrudTrabalhoProjetoComponent,
  },
  {
    path: 'trabalhosprojetosmanu/:id_empresa/:id_projeto/:id_tarefa',
    component: CrudTrabalhosProjetosComponent,
  },
  {
    path: 'planejamentolancamento/:id_empresa/:id',
    component: LancamentoComponent,
  },
  {
    path: 'planejamentolancamento/:id_empresa/:id',
    component: LancamentoComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'estruturas', component: CrudEstruturaComponent },
  {
    path: 'estrutura/:id_empresa/:conta/:subconta/:acao',
    component: CrudViewEstruturaComponent,
  },
  {
    path: 'subconta/:id_empresa/:conta/:subconta/:descricao/:nivel/:acao',
    component: CrudSubestruturaComponent,
  },
  {
    path: 'treeconta/:id_empresa/:conta/:subconta',
    component: TreeEstruturaComponent,
  },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
