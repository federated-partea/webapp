import {Component} from '@angular/core';
import {UserModel} from './models/user.model';
import {Router} from '@angular/router';
import {UserService} from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public user: UserModel | null = null;

  constructor(private router: Router, private users: UserService) {
    this.users.subscribeUser((user) => {
      this.user = user;
    });
  }

}
