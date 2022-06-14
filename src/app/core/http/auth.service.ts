import { Injectable } from '@angular/core';
import { ApiService } from '@core/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  private endpoint: string = '';

  constructor(private router: Router) {
    super();
  }

  login(data: object): any {
    return this._post(``,
      {
        method: 'loginDashboard',
        api_version:'0',
        data: data
      }
    );
  }


  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
