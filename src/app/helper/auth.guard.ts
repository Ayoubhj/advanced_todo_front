import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../main/services/auth.service';



@Injectable()
export class AuthGuard  {

  constructor(private _authService: AuthService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this._authService.loggedIn()){
        return true;
      }else{
        this.router.navigate(['/']);
        return false;
      }
  }
}