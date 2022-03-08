import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditorViewsComponent } from './auditor-views.component';
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
  declarations: [AuditorViewsComponent],
  exports:[AuditorViewsComponent]
})
export class AuditorViewsModule { }
