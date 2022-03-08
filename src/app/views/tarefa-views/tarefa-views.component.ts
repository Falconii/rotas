import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { TarefaModel } from 'src/app/Models/tarefa-model';
import { TarefasService } from 'src/app/services/tarefas.service';

@Component({
  selector: 'app-tarefa-views',
  templateUrl: './tarefa-views.component.html',
  styleUrls: ['./tarefa-views.component.css'],
})
export class TarefaViewsComponent implements OnInit {
  @Input() codigoTarefa: string = '';
  formulario: FormGroup;
  tarefa: TarefaModel = new TarefaModel();
  tarefas: TarefaModel[] = [];
  inscricaoGetOne?: Subscription;
  erro: string = '';

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    router: Router,
    private tarefasService: TarefasService
  ) {
    this.formulario = this.formBuilder.group({
      codigo: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      descricao: [
        null,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  ngOnInit() {
    this.getterOne();
  }

  onSubmit() {
    console.log(this.formulario);
    console.log(this.formulario.value.codigo);
    console.log(this.formulario.value.descricao);
    this.http
      .post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .subscribe(
        (dados) => {
          console.log('Retorno');
          console.log(dados);
          this.formulario.reset();
        },
        (error: any) => {
          console.log(error.headers);
          alert('Falha na gravação');
        }
      );
  }

  ngOnDestroy() {
    this.inscricaoGetOne?.unsubscribe();
  }

  getterOne() {
    console.log('Estou no GETONE');

    this.inscricaoGetOne = this.tarefasService
      .getTarefa(1, this.codigoTarefa)
      .subscribe(
        (data: TarefaModel) => {
          console.log(data);
          this.tarefa = data;
          console.log('Resultado GETONE', data);
          console.log('CODIGO:', data.codigo);
          console.log('DESCRICAO:', data.descricao);
          this.formulario.patchValue({
            codigo: this.tarefa.codigo,
            descricao: this.tarefa.descricao,
            endereco: 'teste',
          });
        },
        (error: any) => {
          this.erro = error;
          console.log('Erro No GetOne ', error);
        }
      );
  }

  itsDisabled(): boolean {
    return !this.formulario.valid;
  }

  teste(): boolean {
    let retorno: boolean = false;

    if (this.formulario.get('descricao')?.valid) {
      retorno = true;
    }

    return retorno;
  }
}
