import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';

type Page = 'ACCOUNT' | 'SIGNUP' | 'LOGIN' | 'LOGOUT';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  private static PAGE_NAMES: { [page in Page]: string } = {
    ACCOUNT: 'Account',
    SIGNUP: 'Sign up',
    LOGIN: 'Log in',
    LOGOUT: 'Log out',
  };

  private queryP: string | null = null;

  public appMessage = '';

  public user = null;
  public page: Page;
  public pageName: string;
  public step = 1;

  // Login
  public loginUsername: string;
  public loginPassword: string;

  // Signup
  public signupUsername: string;
  public signupPassword: string;

  // Confirm
  public confirmUsername: string;
  public confirmPassword: string;

  constructor(private route: ActivatedRoute, private router: Router, public users: UserService) {
    this.users.subscribeUser((user) => {
      this.user = user;
      this.updatePage();
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.queryP = params.p || null;
      this.updatePage();
    });
  }

  private async updatePage() {
    if (this.user) {
      if (this.queryP === 'logout') {
        this.appMessage = `Please confirm to logout by clicking the 'Log out' button below.`;
        this.setPage('LOGOUT');
      } else {
        if (this.queryP) {
          await this.router.navigate(['account']);
          return;
        }
        this.appMessage = `Hello, ${this.user.name}.`;
        this.setPage('ACCOUNT');
      }
    } else if (this.queryP === 'login') {
      this.appMessage = `To login you, please tell your username and password.`;
      this.setPage('LOGIN');
    } else {
      this.appMessage = `Please choose a username and password.`;
      this.setPage('SIGNUP');
    }
  }

  public async login() {
    this.appMessage = `Thank you! Looking for your account...`;
    const result = await this.users.login(this.loginUsername, this.loginPassword);
    if (!result.result) {
      this.appMessage = result.message;
    }
  }

  public signup() {
    this.appMessage = `Thank you, ${this.signupUsername}! Now please enter the data again to confirm.`;
    this.step = 2;
  }

  public async confirm() {
    if (this.signupUsername !== this.confirmUsername) {
      this.appMessage = `Is your name ${this.confirmUsername}?
You previously entered ${this.signupUsername}.
Please make your choice.`;
      this.step = 1;
      this.signupUsername = this.confirmUsername;
      this.confirmUsername = '';
      this.signupPassword = '';
      this.confirmPassword = '';
      return;
    }
    if (this.signupPassword !== this.confirmPassword) {
      this.appMessage = `Hmm, you just gave me two different passwords.
Please enter the password again and confirm afterwards.
I just want to make sure that you don't lock yourself out.`;
      this.step = 1;
      this.signupPassword = '';
      this.confirmPassword = '';
      return;
    }

    this.appMessage = `Thank you! I am creating your account now, please wait a second...`;
    const result = await this.users.signup(this.signupUsername, this.signupPassword);

    this.signupUsername = '';
    this.signupPassword = '';
    this.confirmUsername = '';
    this.confirmPassword = '';

    if (!result.result) {
      this.appMessage = result.message;
      this.step = 1;
    }
  }

  public async logout() {
    await this.users.logout();
    this.router.navigate(['']);
  }

  private setPage(page: Page) {
    this.page = page;
    this.pageName = AccountPageComponent.PAGE_NAMES[page];
  }
}
