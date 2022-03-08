import { ClientesModel } from '../Models/cliente-model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  cliente:ClientesModel = new ClientesModel();

  inscricaoRota!:Subscription;

  constructor(private route:ActivatedRoute) {

     console.log(route);
     this.inscricaoRota = route.params.subscribe(

       (params:any) => {
         this.cliente.id = params.id;
         this.cliente.cnpj_cpf = params.cnpj_cpf;
         this.cliente.razao = params.razao;
        } );

   }

  ngOnInit(): void {
  }

}
