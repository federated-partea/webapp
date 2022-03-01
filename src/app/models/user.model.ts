import { BaseModel, IModelJson } from './base.model';

export interface UserJson extends IModelJson {

  username: string;
  email: string;
  is_staff: boolean;

}

export class UserModel extends BaseModel<UserJson> {

  private _email: string;
  private _name: string;
  private _isStaff: boolean;

  constructor() {
    super();
  }

  public async refresh(user: UserJson) {
    this._id = user.id;
    this._email = user.email;
    this._name = user.username;
    this._isStaff = user.is_staff;
  }

  public get name(): string {
    return this._name;
  }

}
