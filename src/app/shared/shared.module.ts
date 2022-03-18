import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDebugComponent } from './form-debug/form-debug.component';
import { HoraSexagenalPipe } from './hora-sexagenal.pipe';
import { SimNaoPipe } from './sim-nao.pipe';
import { SituacaoTarefaTrabalhoPipe } from './situacao-tarefa-trabalho.pipe';
import { SituacaoTrabalhoProjetoPipe } from './situacao-trabalho-projeto.pipe';
import { SituacaoProjetoPipe } from './situacao-projeto.pipe';

@NgModule({
  declarations: [
    FormDebugComponent,
    HoraSexagenalPipe,
    SimNaoPipe,
    SituacaoTarefaTrabalhoPipe,
    SituacaoTrabalhoProjetoPipe,
    SituacaoProjetoPipe,
  ],
  imports: [CommonModule],
  exports: [
    FormDebugComponent,
    HoraSexagenalPipe,
    SimNaoPipe,
    SituacaoTarefaTrabalhoPipe,
    SituacaoTrabalhoProjetoPipe,
    SituacaoProjetoPipe,
  ],
})
export class SharedModule {}
