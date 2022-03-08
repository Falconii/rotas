import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TarefaModel } from '../Models/tarefa-model';

@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.component.html',
  styleUrls: ['./tarefa.component.css']
})
export class TarefaComponent implements OnInit {

  inscricaoRota : Subscription;
  tarefa:TarefaModel = new TarefaModel();
  codigo:string = "";

  constructor(private route:ActivatedRoute)
   {
      this.inscricaoRota = route.params.subscribe((params:any)=>{
      this.codigo = params.CODIGO;
      console.log("Rota ",params);
      });

   }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.inscricaoRota.unsubscribe;
  }
}
