import { BemVindoModels } from './Models/bem-vindo-models';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalService } from './global.service';
import { Route, Router } from '@angular/router';
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

  constructor(private svGlobal: GlobalService, private router: Router) {}

  ngOnInit() {
    this.ambiente = environment.ambiente;
    this.apiURL = environment.apiURL;
  }

  ngOnDestroy() {
    this.inscricao?.unsubscribe();
  }

  onLogin() {
    this.router.navigate(['login']);
  }
}
