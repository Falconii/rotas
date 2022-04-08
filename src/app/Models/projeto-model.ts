export class ProjetoModel {
  public id_empresa: number = 0;
  public id: number = 0;
  public id_cliente: number = 0;
  public id_diretor: number = 0;
  public dataprop: Date = new Date();
  public dataproj: Date = new Date();
  public dataenc: Date = new Date();
  public descricao: string = '';
  public horasve: number = 0;
  public horasplan: number = 0;
  public horasexec: number = 0;
  public status: string = '';
  public user_insert: number = 0;
  public user_update: number = 0;
  public diretor_razao: string = '';
  public cliente_razao: string = '';
  public cliente_gru_econo: number = 0;
}
