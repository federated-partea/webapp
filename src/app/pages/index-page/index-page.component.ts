import { Component } from '@angular/core';
import {UserService} from '../../services/user.service';
import {UserModel} from '../../models/user.model';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.scss']
})
export class IndexPageComponent {
  private readonly users: UserService;

  public user?: UserModel;

  constructor(users: UserService) {
    this.users = users;

    // tslint:disable-next-line:no-async-without-await
    this.users.subscribeUser(async (user: UserModel | undefined): Promise<void> => {
      this.user = user;
    });
  }
}
