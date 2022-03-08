import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDebugComponent } from './form-debug/form-debug.component';
import { HoraSexagenalPipe } from './hora-sexagenal.pipe';

@NgModule({
  declarations: [FormDebugComponent, HoraSexagenalPipe],
  imports: [CommonModule],
  exports: [FormDebugComponent, HoraSexagenalPipe],
})
export class SharedModule {}
