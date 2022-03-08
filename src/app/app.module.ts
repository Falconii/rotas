import { CrudAuditorModule } from './crud-auditor/crud-auditor.module';
import { MaterialModule } from './material/material.module';
import { ClienteViewsModule } from './views/cliente-views/cliente-views.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteComponent } from './cliente/cliente.component';
import { SharedModule } from './shared/shared.module';
import { TarefaComponent } from './tarefa/tarefa.component';
import { TarefasComponent } from './tarefas/tarefas.component';
import { FeriadoComponent } from './feriado/feriado.component';
import { FeriadosComponent } from './feriados/feriados.component';
import { TarefaViewsModule } from './views/tarefa-views/tarefa-views.module';
import { FeriadoViewsModule } from './views/feriado-views/feriado-views.module';
import { CrudModule } from './crud/crud.module';
import { CrudViewModule } from './views/crud-view/crud-view.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PlanejamentoModule } from './planejamento/planejamento.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ClientesComponent,
    ClienteComponent,
    TarefaComponent,
    TarefasComponent,
    FeriadoComponent,
    FeriadosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ClienteViewsModule,
    TarefaViewsModule,
    FeriadoViewsModule,
    CrudAuditorModule,
    CrudViewModule,
    CrudModule,
    MaterialModule,
    PlanejamentoModule,
  ],
  providers: [HttpClient, { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
