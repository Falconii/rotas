import { Subscription } from 'rxjs';
import { FeriadoModel } from './../Models/feriado-model';
import { TarefaModel } from 'src/app/Models/tarefa-model';
import { Component, OnInit } from '@angular/core';
import { FeriadosService } from '../services/feriados.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feriados',
  templateUrl: './feriados.component.html',
  styleUrls: ['./feriados.component.css']
})
export class FeriadosComponent implements OnInit {


  feriados:FeriadoModel[] = [];

  inscricaoFeriados?:Subscription;

  erro:string = "";

  constructor(private feriadosService:FeriadosService,
              private router:Router) { }

  ngOnInit(): void {
    this.getter();
  }

  getter(){
    this.inscricaoFeriados = this.feriadosService.getFeriados().subscribe(
      (data:FeriadoModel[]) => {this.feriados = data; console.log(this.feriados)},
      (error:any) => {this.erro = error;});
  }

  escolha(obj:FeriadoModel){

    this.router.navigate(["/feriado",obj.DATFER]);

  }

}
