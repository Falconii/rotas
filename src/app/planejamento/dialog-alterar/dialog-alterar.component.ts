import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogAlterar {
  data: string;
  manha_estado: string;
  tarde_estado: string;
  manha_op: String;
  tarde_op: string;
  manha_obs: string;
  tarde_obs: string;
}

@Component({
  selector: 'app-dialog-alterar',
  templateUrl: './dialog-alterar.component.html',
  styleUrls: ['./dialog-alterar.component.css'],
})
export class DialogAlterarComponent implements OnInit {
  resp_ok = 'SIM';

  respostas: string[] = ['Vago', 'Planejado'];

  parametros: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogAlterarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAlterar
  ) {
    this.parametros = formBuilder.group({
      manha_op: [null],
      manha_obs: [null],
      tarde_op: [null],
      tarde_obs: [null],
    });
    this.setValues();
  }

  ngOnInit(): void {}

  onNoClick() {
    this.dialogRef.close();
  }

  setValues() {
    this.parametros.setValue({
      manha_op: this.data.manha_op,
      manha_obs: this.data.manha_obs.trim(),
      tarde_op: this.data.tarde_op,
      tarde_obs: this.data.tarde_obs.trim(),
    });
  }
}
