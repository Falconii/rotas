import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LancamentoComponent } from './lancamento/lancamento.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [LancamentoComponent],
  imports: [CommonModule, MaterialModule],
  exports: [LancamentoComponent],
})
export class PlanejamentoModule {}
