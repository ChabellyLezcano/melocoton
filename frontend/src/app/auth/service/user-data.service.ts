import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/auth/interfaces/authInterface';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private userDataSubject = new BehaviorSubject<User | null>(null);
  userData$ = this.userDataSubject.asObservable();

  constructor() {
    // Recupera los datos del usuario desde el almacenamiento local al iniciar el servicio
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      this.userDataSubject.next(JSON.parse(storedUser));
    }
  }

  updateUserData(user: User | null) {
    // Actualiza los datos del usuario
    this.userDataSubject.next(user);

    // Almacena los datos del usuario en el almacenamiento local para persistencia
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
