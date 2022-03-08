import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TarefaModel } from '../Models/tarefa-model';
import { TarefasService } from '../services/tarefas.service';

@Component({
  selector: 'app-tarefas',
  templateUrl: './tarefas.component.html',
  styleUrls: ['./tarefas.component.css'],
})
export class TarefasComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetOne!: Subscription;

  tarefas: TarefaModel[] = [];
  tarefa: TarefaModel = new TarefaModel();

  erro: string = '';

  constructor(
    private tarefasServices: TarefasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getter();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetOne?.unsubscribe();
  }

  getter() {
    this.inscricaoGetAll = this.tarefasServices.getTarefas().subscribe(
      (data: TarefaModel[]) => {
        this.tarefas = data;
      },
      (error: any) => {
        this.erro = error;
      }
    );
  }

  getterOne() {
    this.inscricaoGetOne = this.tarefasServices
      .getTarefa(1, '001000')
      .subscribe(
        (data: TarefaModel) => {
          this.tarefa = data;
          console.log('Peguei a Tarefa: ', this.tarefa);
        },
        (error: any) => {
          this.erro = error;
        }
      );
  }

  Escolha(obj: TarefaModel) {
    this.router.navigate(['/tarefa', obj.codigo]);
  }
}
