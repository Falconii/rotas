import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeriadoViewsComponent } from './feriado-views.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [FeriadoViewsComponent],
  exports:[FeriadoViewsComponent]
})
export class FeriadoViewsModule { }
