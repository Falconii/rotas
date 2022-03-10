export class ApoPlanejamentoMoldel {
  public id_empresa: number = 0;
  public id: number = 0;
  public id_projeto: number = 0;
  public id_tarefa: string = '';
  public id_trabalho: string = '';
  public id_resp: number = 0;
  public id_exec: number = 0;
  public Inicial: Date = new Date();
  public Final: Date = new Date();
  public horasapon: number = 0;
  public obs: string = '';
  public encerra: string = '';
  public user_insert: number = 0;
  public user_update: number = 0;
  public resp_razao: string = '';
  public exec_razao: string = '';
  public trab_descricao: string = '';
}
