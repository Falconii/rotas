import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TarefaViewsComponent } from './tarefa-views.component';
import { MaterialModule } from './../../material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TarefaViewsComponent,
   ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    TarefaViewsComponent,

  ]
})
export class TarefaViewsModule { }
