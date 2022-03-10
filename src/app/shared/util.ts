import { Dias_Planejados } from './dias-planejados';

export function nextCode(value: string): string {
  let base: string = value.substring(0, 3);
  let chave: string = value.substring(3);
  let nro: number = 0;
  let retorno = '';
  try {
    nro = parseInt(chave) + 1;
    retorno = '000' + nro.toString();
    retorno = retorno.substring(retorno.length - 3);
    retorno = base + retorno;
  } catch (err) {
    console.log('Problemas Com Chave', value);
  }

  return retorno;
}

export class MensagensBotoes {
  static incluir: string = 'Novo Registro';
  static alterar: string = 'Alterar Registro';
  static consultar: string = 'Consulta registro';
  static excluir: string = 'Excluir Registro';
  static tarefas_incluir = 'Manutenção Das Tarefas';
  static trabalhos_incluir = 'Manutenção Dos Trabalhos';
  static planejamentos_manutencao = 'Manutenção Dos Planejamentos';
}

export function DiasUteis(Inicial: string, Final: string): Dias_Planejados[] {
  let retorno: Dias_Planejados[] = [];

  let x = 0;

  const date1 = new Date(Inicial);

  const date2 = new Date(Final);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  for (x = 0; x <= diffInDays; x++) {
    const proxima = new Dias_Planejados();
    proxima.data.setDate(date1.getDate() + x);
    proxima.manha = false;
    proxima.tarde = false;
    if (proxima.data.getDay() != 6 && proxima.data.getDay() != 0) {
      retorno.push(proxima);
    }
  }
  return retorno;
}

function adicionaZero(numero: number) {
  if (numero <= 9) return '0' + numero;
  else return numero;
}

export function formatarData(date: any): string {
  console.log('date', date);

  if (date == null) {
    return '';
  }

  if (typeof date === 'string') {
    return date;
  } else {
    let data = new Date(date);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }
}

export function formatDateHour(date: Date) {
  return date;
}
