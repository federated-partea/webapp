import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserJson, UserModel } from '../models/user.model';
import { BaseModel, IModelJson } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class UserService implements RestProvider<UserModel, UserJson> {

  private user = new BehaviorSubject<UserModel | null>(null);

  constructor(private api: ApiService) {
    this.getInfo().then(() => {
    });

    let intervalHandle: any = null;
    this.user.subscribe((user) => {
      if (intervalHandle) {
        clearInterval(intervalHandle);
        intervalHandle = null;
      }
      if (!user) {
        return;
      }
      intervalHandle = setInterval(() => {
        this.api.get<UserJson>(`/user/info/`).then(async (json) => {
          await user.refresh(json);
        });
      }, 10 * 1000);
    });
  }

  public async get(id: number): Promise<UserModel | null> {
    // TODO
    return null;
  }

  public getUser(): UserModel | null {
    return this.user.getValue();
  }

  public subscribeUser(cb: (value: UserModel | null) => void): Subscription {
    return this.user.subscribe(cb);
  }

  public async login(username: string, password: string): Promise<{ result: boolean, user: UserModel | null, message: string }> {
    return this.api.post<{ result: boolean, user: UserModel | null, message: string }>(`/auth/login/`, {
      username,
      password
    }, false)
      .then(async (json: any) => {
        this.api.setAccessToken(json.access);
        this.api.setRefreshToken(json.refresh);
        const user = await this.getInfo();
        if (!user) {
          return {
            result: false,
            user: null,
            message: `I could not fetch your user info. That's odd, I'm afraid I don't know what to do.`
          };
        }
        return {user, result: true, message: ''};
      })
      .catch(async (reason: any) => {
        if (reason.error.detail) {
          return {
            result: false,
            user: null,
            message: `Something is wrong with the credentials.
The system says '${reason.error.detail}', please check again if everything has been entered correctly.`
          };
        } else if (reason.error.username) {
          return {
            result: false,
            user: null,
            message: `Something is wrong with the username.
The system says '${reason.error.username}', please check again if the username is correct.`
          };
        } else if (reason.error.password) {
          return {
            result: false,
            user: null,
            message: `Something is wrong with the password.
The system says '${reason.error.password}', please check again if the password is correct.`
          };
        }
      });
  }

  public async logout(): Promise<void> {
    this.api.setAccessToken(null);
    this.api.setRefreshToken(null);
    this.user.next(null);
    await this.api.post(`/auth/logout/`, {
      refresh: this.api.getRefreshToken(),
    });
  }

  public async signup(username: string, password: string): Promise<{ result: boolean, user: UserModel | null, message: string }> {
    return this.api.post<{ result: boolean, user: UserModel | null, message: string }>(`/auth/signup/`, {
      username,
      password
    }, false)
      .then(async (json: any) => {
        return await this.login(username, password);
      })
      .catch(async (reason: any) => {
        return {
          result: false,
          user: null,
          message: `Something went wrong, I am sorry. The system tells me '${reason.statusText}'.`
        };
      });
  }

  private async getInfo(refresh = true): Promise<UserModel | null> {
    return await this.api.get<UserJson>(`/user/info/`).then(async (json) => {
      const user = await this.fromJson(json);
      this.user.next(user);
      return user;
    }).catch(async (reason: any) => {
      if (refresh) {
        const success = await this.api.refreshAccess();
        if (success) {
          return await this.getInfo();
        }
      }
      return null;
    });
  }

  public async fromJson(json: UserJson): Promise<UserModel> {
    const obj = new UserModel();
    await obj.refresh(json);
    return obj;
  }

}

export interface RestProvider<M extends BaseModel<J>, J extends IModelJson> {

  get(id: number): Promise<M | null>;

  fromJson(json: J): Promise<M>;

}
