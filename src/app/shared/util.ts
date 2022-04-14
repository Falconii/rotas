import { MoviData } from './../Models/movi-data';
import { Dias_Planejados } from './dias-planejados';

export function DataYYYYMMDD(value: Date): string {
  let d: Date = new Date(value),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

/*
exports Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

*/
export function DataYYYYMMDDTHHMMSSZ(value: Date): string {
  let d: Date = new Date(value),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' + d.getFullYear(),
    hora = '' + d.getHours(),
    min = '' + d.getMinutes(),
    seg = '' + d.getSeconds();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hora.length < 2) hora = '0' + hora;
  if (min.length < 2) min = '0' + min;
  if (seg.length < 2) seg = '0' + seg;
  return (
    [year, month, day].join('-') + 'T' + [hora, min, seg].join(':') + '.000Z'
  );
}

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
  static sub_conta = 'Acesso As SubContas.';
}

export function DiasUteis(Inicial: string, Final: string): Dias_Planejados[] {
  let retorno: Dias_Planejados[] = [];

  let x = 0;

  const date1 = new Date(Inicial);

  const date2 = new Date(Final);

  date1.setHours(0);
  date1.setMinutes(0);

  date2.setHours(0);
  date2.setMinutes(0);

  console.log('Data Inicial e Final ', Inicial, Final);

  console.log('Data Base ', date1, date2);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  for (x = 0; x <= diffInDays; x++) {
    const proxima = new Dias_Planejados();
    proxima.data.setDate(date1.getDate() + x);
    //proxima.data_ = proxima.data.toISOString();
    //proxima.data_ = proxima.data.toLocaleDateString('pt-BR', {
    //  timeZone: 'UTC',
    //});
    proxima.data_ = DataYYYYMMDD(proxima.data);
    proxima.manha = '0';
    proxima.tarde = '0';
    if (proxima.data.getDay() != 6 && proxima.data.getDay() != 0) {
      retorno.push(proxima);
    }
  }
  return retorno;
}

export function DiasUteisV2(
  Inicial: string,
  Final: string,
  id_exec: number
): MoviData[] {
  let retorno: MoviData[] = [];

  let x = 0;

  const date1 = new Date(Inicial);

  const date2 = new Date(Final);

  date1.setHours(0);
  date1.setMinutes(0);

  date2.setHours(0);
  date2.setMinutes(0);

  console.log('Data Inicial e Final ', Inicial, Final);

  console.log('Data Base ', date1, date2);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  for (x = 1; x <= diffInDays + 1; x++) {
    const proxima = new MoviData();
    proxima.movimentos = [];
    proxima.id_exec = id_exec;
    proxima.data.setDate(date1.getDate() + x);
    proxima.data.setHours(0);
    proxima.data.setMinutes(0);
    console.log('Proxima loop =>', proxima.data);
    proxima.data_ = DataYYYYMMDD(proxima.data);
    if (proxima.data.getDay() != 6 && proxima.data.getDay() != 0) {
      console.log('Proxima=>', proxima);
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

export function DifHoras(Inicial: string, Final: string): number {
  let retorno: Dias_Planejados[] = [];

  let x = 0;

  const date1 = new Date(Inicial);

  const date2 = new Date(Final);

  console.log('Data Inicial e Final ', date1, date2);

  // One day in milliseconds
  const oneMin = 1000 * 60;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneMin);

  return diffInDays;
}

export function hhmm(minutos: number): string {
  const str = (minutos / 60).toString();

  const parte = str.split('.');

  const horas = parseInt(parte[0]);

  const min = minutos - horas * 60;

  let hora = '' + horas.toString();

  let minu = '' + min.toString();

  if (hora.length < 2) hora = '0' + hora;

  if (minu.length < 2) minu = '0' + minu;

  return hora + ':' + minu;
}

export function minutostostohorasexagenal(minutos: number): number {
  const str = (minutos / 60).toString();

  const parte = str.split('.');

  const horas = parseInt(parte[0]);

  console.log('Horas=>', horas);

  let min = minutos - horas * 60;

  console.log('Minutos->', min);

  min = Number.parseInt((min * 1.67).toFixed(0)) / 100;

  console.log('Minutos Convertidos ->', min);

  return horas + min;
}

export function horahexa(value: number): string {
  let numero: string = Number(value).toFixed(2);
  let horas: string = numero.substring(0, numero.indexOf('.'));
  let minutos: string = numero.substring(numero.indexOf('.') + 1);
  minutos = '00' + (Number.parseInt(minutos) / 1.67).toFixed(0).trim();
  minutos = minutos.substring(minutos.length - 2);
  if (minutos.length < 2) minutos = '0' + minutos;
  console.log('Minutos', minutos, 'Lengh ');
  return horas + ':' + minutos;
}

export function setHorario(
  value: Date,
  horas: number,
  minutos: number
): string {
  let retorno: string = '';
  let dt = new Date(value);
  dt.setHours(horas);
  dt.setMinutes(minutos);
  retorno = DataYYYYMMDDTHHMMSSZ(dt);
  return retorno;
}

export function getHora(hora: string): number {
  let retorno: number = 0;
  retorno = parseInt(hora.split(':')[0]);
  return retorno;
}

export function getMinuto(hora: string): number {
  let retorno: number = 0;
  retorno = parseInt(hora.split(':')[1]);
  return retorno;
}

export function setDBtoAngular(value: string): string {
  let retorno = '';
  retorno = value.replace(' ', 'T') + '.000Z';
  return retorno;
}
