import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../main/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  refresh = false   
  constructor(private authenticationService: AuthService,private router : Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (localStorage.getItem("accessToken")) {
      request = request.clone({
        setHeaders: {
            'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
    }

    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status == 403 && !this.refresh) {
        this.refresh = true
        const token = {
           token : localStorage.getItem("refreshToken")
        }
        return this.authenticationService.refreshToken(token).pipe(
          switchMap(user => {
            this.router.navigate([this.router.url])
            return next.handle(request.clone({
              setHeaders: {
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              }
            }));
          })
        )
      }
      this.refresh = false
      return throwError(() => {
         this.authenticationService.logout()
         localStorage.clear()
         this.router.navigate(["/"])
      })
    }));
  }

}
