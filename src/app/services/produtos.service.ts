import { ProdutosModel } from '../Models/produto-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  produtos:ProdutosModel[] = [];

  inscricao!:Subscription;

  erro:string="";

  constructor(private http:HttpClient) {

    console.log("Servico no ar");
    this.inscricao = this._getProdutos().subscribe(
      (data:ProdutosModel[]) => {
       console.log(data);
       this.produtos = data;
       console.log("Tabela Carregada...");
      },
      (error:any) => {
       this.erro = error;
      }
    );

  }

  onNgDestroy(){
    console.log("Servico fora do ar");
    this.inscricao.unsubscribe();
  }

  private _getProdutos():Observable<ProdutosModel[]>{

    return this.http.get<ProdutosModel[]>('http://localhost:3052/produtos');

  }

  getProdutos():ProdutosModel[]{

     return this.produtos;

  }

  seekProdutos(chave:string):ProdutosModel{

    var retorno = new ProdutosModel();

    console.log("SEEK ",chave);

    this.produtos.forEach(obj => {
      if (chave == obj.ID){
          retorno = obj;
          console.log("ACHE!",retorno);
      }
    });

    console.log("Retornando...",retorno);
    return retorno;

  }


}
