import {BaseModel, IModelJson} from './base.model';

export interface TokenJson extends IModelJson {

  token: string;
  project_id: number;
  user_id: number | null;
  name: string;
  last_action: string;
  created_at: string;

}

export class TokenModel extends BaseModel<TokenJson> {

  private _token: string;
  private _projectId: number;
  private _userId: number | null;
  private _name: string;
  private _lastAction: string;
  private _createdAt: Date;

  constructor() {
    super();
  }

  public async refresh(token: TokenJson) {
    this._id = token.id;
    this._token = token.token;
    this._projectId = token.project_id;
    this._userId = token.user_id;
    this._name = token.name;
    this._lastAction = token.last_action;
    this._createdAt = new Date(token.created_at);
  }

  public get token(): string {
    return this._token;
  }

  public get userId(): number | null {
    return this._userId;
  }

  public get name(): string | null {
    return this._name;
  }

  public get lastAction(): string {
    return this._lastAction;
  }

}
