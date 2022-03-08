import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudAuditorComponent } from './crud-auditor.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuditorViewsModule } from '../views/auditor-views/auditor-views.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AuditorViewsModule,
    SharedModule
  ],
  declarations: [CrudAuditorComponent],
  exports:[CrudAuditorComponent]
})
export class CrudAuditorModule { }
