import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountPageComponent } from './account-page.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

describe('AccountPageComponent', () => {
  let component: AccountPageComponent;
  let fixture: ComponentFixture<AccountPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountPageComponent],
      imports: [RouterTestingModule.withRoutes([
        {
          path: 'account',
          component: AccountPageComponent,
        }
      ]), FormsModule, HttpClientModule],
      providers: []
    })
      .compileComponents();
    fixture = TestBed.createComponent(AccountPageComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
