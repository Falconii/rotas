import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'situacaoProjeto',
})
export class SituacaoProjetoPipe implements PipeTransform {
  transform(value: string): string {
    let retorno = '';

    if (value == '0') return 'Proposta';
    if (value == '1') return 'Projeto Em Aberto';
    if (value == '2') return 'Tarefas OK';
    if (value == '3') return 'Trabalhos OK';
    if (value == '4') return 'Planejamento Trabalhos OK';
    if (value == '5') return 'Em Andamento';
    if (value == '6') return 'Encerrado';
    if (value == '7') return 'Suspenso';
    if (value == '8') return 'Cancelado';

    return '';
  }
}
