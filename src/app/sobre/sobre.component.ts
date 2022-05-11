import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css'],
})
export class SobreComponent implements OnInit {
  constructor(private router: Router) {}

  versao: string = '';
  data: string = '';
  ambiente: string = '';
  apiURL: string = '';

  ngOnInit(): void {
    this.versao = environment.versao;
    this.data = environment.data;
    this.ambiente = environment.ambiente;
    this.apiURL = environment.apiURL;
  }

  onRetorno() {
    this.router.navigate(['/']);
  }
}
