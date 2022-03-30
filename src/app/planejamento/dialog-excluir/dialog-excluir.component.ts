import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogExcluir {
  id_empresa: number;
  data: string;
  manha_estado: string;
  tarde_estado: string;
  manha_id: 0;
  tarde_id: 0;
}

@Component({
  selector: 'app-dialog-excluir',
  templateUrl: './dialog-excluir.component.html',
  styleUrls: ['./dialog-excluir.component.css'],
})
export class DialogExcluirComponent implements OnInit {
  resp_ok = 'SIM';

  constructor(
    public dialogRef: MatDialogRef<DialogExcluirComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogExcluir
  ) {}
  ngOnInit(): void {}

  onNoClick() {
    this.dialogRef.close();
  }
}
