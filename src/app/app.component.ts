import { BemVindoModels } from './Models/bem-vindo-models';
import { Subscription } from 'rxjs';
import { TarefasService } from 'src/app/services/tarefas.service';
import { ProdutosService } from './services/produtos.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'rotas';
  hora: number = 3.8;
  ambiente: string = '';
  apiURL: string = '';

  inscricao?: Subscription;
  erro: string = '';
  hello: BemVindoModels = new BemVindoModels();

  constructor(private svTarefas: TarefasService) {}

  ngOnInit() {
    this.ambiente = environment.ambiente;
    this.apiURL = environment.apiURL;
  }

  ngOnDestroy() {
    this.inscricao?.unsubscribe();
  }
}
