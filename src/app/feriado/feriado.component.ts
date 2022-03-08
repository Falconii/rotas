import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feriado',
  templateUrl: './feriado.component.html',
  styleUrls: ['./feriado.component.css']
})
export class FeriadoComponent implements OnInit {

  inscricaoRota:Subscription;
  datFer:string = "";

  constructor(private route:ActivatedRoute) {
    this.inscricaoRota = route.params.subscribe((params:any)=>{
      this.datFer = params.DATFER;
      console.log("Rota ",params);
      });
   }

  ngOnInit(): void {
  }

}
