import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeriadosService } from 'src/app/services/feriados.service';

@Component({
  selector: 'app-feriado-views',
  templateUrl: './feriado-views.component.html',
  styleUrls: ['./feriado-views.component.css']
})
export class FeriadoViewsComponent implements OnInit {

  formulario:FormGroup;

  constructor( private formBuilder:FormBuilder, router:Router,
    private feriadosService:FeriadosService) {
    this.formulario = this.formBuilder.group({
      datfer:[null],
      descricao:[null]
    });
  }

  ngOnInit() {
  }


  onSubmit(){

  }
}
