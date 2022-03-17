export class Dias_Planejados {
  public mark: Boolean = false;
  public data: Date = new Date();
  public data_: string = '';
  public manha: Boolean = false;
  public tarde: Boolean = false;
  public manha_id_empresa: number = 0;
  public manha_id_apo_planejamento = 0;
  public manha_horario: string = '';
  public manha_obs: string = '';
  public tarde_id_empresa: number = 0;
  public tarde_id_apo_planejamento = 0;
  public tarde_horario: string = '';
  public tarde_obs: string = '';
}
