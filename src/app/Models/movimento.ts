export class Movimento {
  public id_empresa: number = 0;
  public id: number = 0;
  public id_projeto: number = 0;
  public id_conta: string = '';
  public id_subconta: string = '';
  public id_resp: number = 0;
  public id_exec: number = 0;
  public inicial: Date = new Date();
  public final: Date = new Date();
  public obs: string = '';
  public horasapon: number = 0;
  public encerra: string = '';
  public user_insert: number = 0;
  public user_update: number = 0;
}
