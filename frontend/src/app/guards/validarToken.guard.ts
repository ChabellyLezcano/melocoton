import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthServiceTsService } from '../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard  {
  
  constructor( private authService: AuthServiceTsService,
               private router: Router ){}


  canActivate(): Observable<boolean> | boolean {
    return this.authService.validateToken()
            .pipe(
              tap( valid => {
                if ( !valid ) {
                  this.router.navigateByUrl('/login');
                  console.log("Error en el can activate")
                }
              })
            );
  }

  canLoad(): Observable<boolean> | boolean {
    return this.authService.validateToken()
      .pipe(
        tap( valid => {
          if ( !valid ) {
            this.router.navigateByUrl('/login');
            console.log("Error en el can load")
          }
        })
      );
  }
}

