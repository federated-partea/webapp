export interface IModelJson {

  id?: number | null;

}

export abstract class BaseModel<J extends IModelJson> {

  protected _id: number;
  protected _needSave: boolean;

  protected constructor() {
    this._needSave = false;
  }

  public get id(): number {
    return this._id;
  }

  public abstract refresh(json: J): Promise<void>;

}
