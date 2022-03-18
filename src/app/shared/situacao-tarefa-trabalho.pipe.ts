import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'situacaoTarefaTrabalho',
})
export class SituacaoTarefaTrabalhoPipe implements PipeTransform {
  transform(value: string): string {
    let retorno = '';
    if (value == '0') return 'Em Aberta';
    if (value == '1') return 'Trabalhos OK';
    if (value == '2') return 'Planejamento Trabalhos';
    if (value == '3') return 'Em Andamento';
    if (value == '4') return 'Encerrada';
    if (value == '5') return 'Suspensa';
    if (value == '6') return 'Cancelada';
    return retorno;
  }
}
