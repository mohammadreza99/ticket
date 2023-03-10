import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {filter, tap} from 'rxjs/operators';
import {AuthService} from "@modules/auth/login/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.authService.hasToken()) {
      if (request.body) {
        const body = Object.assign(request.body, {auth: localStorage.getItem('token'),api_version:0});
        request = request.clone({body});
      }
    }
    return next.handle(request).pipe(filter(e => e instanceof HttpResponse),
      tap(async (e: any) => {
        if (e.body?.status === 'UNAUTHENTICATED') {
          if (this.router.url == 'auth/login') {
            return;
          }
          this.authService.logout();
          this.router.navigate(['/auth/login'], {queryParams: {returnUrl: this.router.url}});
        }
      })
    );
  }
}
