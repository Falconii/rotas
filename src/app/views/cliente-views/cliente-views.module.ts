import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteViewsComponent } from './cliente-views.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ClienteViewsComponent],
  exports: [
    ClienteViewsComponent
  ]
})
export class ClienteViewsModule { }
