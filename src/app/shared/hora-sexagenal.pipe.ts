import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaSexagenal'
})
export class HoraSexagenalPipe implements PipeTransform {

  transform(value: number): string {
    let numero:string = Number(value).toFixed(2);
    let horas:string  = numero.substring(0,numero.indexOf("."));
    let minutos:string = numero.substring(numero.indexOf(".")+1);
    return horas + ":" + ("00"+(Number.parseInt(minutos)/1.67).toFixed(0)).substring(0,2);
  }

}
