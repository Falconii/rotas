import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDebugComponent } from './form-debug/form-debug.component';
import { HoraSexagenalPipe } from './hora-sexagenal.pipe';
import { SimNaoPipe } from './sim-nao.pipe';
import { SituacaoTarefaTrabalhoPipe } from './situacao-tarefa-trabalho.pipe';
import { SituacaoTrabalhoProjetoPipe } from './situacao-trabalho-projeto.pipe';
import { SituacaoProjetoPipe } from './situacao-projeto.pipe';
import { SubcontaPipe } from './subconta.pipe';
import { TipoContaPipe } from './tipo-conta.pipe';
import { SoHorasPipe } from './so-horas.pipe';
import { SituacaoPadraoPipe } from './situacao-padrao.pipe';
import { SharedNavegatorComponent } from './shared-navegator/shared-navegator.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    FormDebugComponent,
    HoraSexagenalPipe,
    SimNaoPipe,
    SituacaoTarefaTrabalhoPipe,
    SituacaoTrabalhoProjetoPipe,
    SituacaoProjetoPipe,
    SubcontaPipe,
    TipoContaPipe,
    SoHorasPipe,
    SituacaoPadraoPipe,
    SharedNavegatorComponent,
  ],
  imports: [CommonModule, MaterialModule],
  exports: [
    FormDebugComponent,
    HoraSexagenalPipe,
    SimNaoPipe,
    SituacaoTarefaTrabalhoPipe,
    SituacaoTrabalhoProjetoPipe,
    SituacaoProjetoPipe,
    SubcontaPipe,
    TipoContaPipe,
    SoHorasPipe,
    SituacaoPadraoPipe,
    SharedNavegatorComponent,
  ],
})
export class SharedModule {}
