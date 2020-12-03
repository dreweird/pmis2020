import { Injectable, Injector, ErrorHandler } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Router } from '@angular/router';
import { authLogout } from '../core.module';
import { Store } from '@ngrx/store';

/** Passes HttpErrorResponse to application-wide error handler */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  user: any;
  constructor(
    private injector: Injector,
    private router: Router,
    private localStorageService: LocalStorageService,
    private store: Store
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.user = JSON.parse(localStorage.getItem('ANMS-AUTH')) || 0;

    if (this.user != 0) {
      if (this.user.user.token) {
        request = request.clone({
          setHeaders: {
            Authorization: this.user.user.token
          }
        });
      }
    }
    return next.handle(request).pipe(
      tap({
        error: (err: any) => {
          if (err instanceof HttpErrorResponse) {
            const appErrorHandler = this.injector.get(ErrorHandler);
            appErrorHandler.handleError(err);
          }
          if (err.status === 401) {
            this.localStorageService.setItem('AUTH', {
              isAuthenticated: false,
              user: {}
            });

            alert('Your session was expired! \n Please Login again.');
            this.store.dispatch(authLogout());
            // this.router.navigate(['/about']);
            // window.location.reload();
          }
      
        }
      })
    );
  }
}
