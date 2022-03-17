import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LancamentoComponent } from './lancamento/lancamento.component';
import { MaterialModule } from '../material/material.module';
import { DialogExcluirComponent } from './dialog-excluir/dialog-excluir.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogAlterarComponent } from './dialog-alterar/dialog-alterar.component';

@NgModule({
  declarations: [
    LancamentoComponent,
    DialogExcluirComponent,
    DialogAlterarComponent,
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [LancamentoComponent, DialogExcluirComponent],
})
export class PlanejamentoModule {}
