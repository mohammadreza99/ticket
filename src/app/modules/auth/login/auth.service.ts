import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Router} from '@angular/router';
import {Login} from "@modules/auth/login/login";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  constructor() {
    super();
  }

  login(data: Login) {
    return this._post(``,
      {
        method: 'loginDashboard',
        data: data,
        api_version:0
      }
    );
  }

  logout() {
    localStorage.removeItem('token')
    // return this._post(``,
    //   {
    //     method: 'logoutDashboard',
    //     data: {auth: localStorage.getItem('token')}
    //   }
    // );
  }

  removeToken() {
    localStorage.removeItem('token')
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
