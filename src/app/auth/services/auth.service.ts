import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { loginResponse, RegisterResponse, User } from '../../shared/interfaces/auth';
import { ContactsService } from '../../contacts/services/contacts.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = 'http://localhost:3000/api/auth';
  // private _userId: string = 'YLnIiIvZntfJ49bhwVFD3';
  private _userId: string = '';
  private isLoggedSignal = signal<boolean>(false);
  private router: Router = inject(Router);

  constructor(){
    let userId = localStorage.getItem('userId');
    if (userId) {
      this._userId = userId;
      this.isLoggedSignal.set(true);
    }
  }

  get isLogged() {
    return this.isLoggedSignal.asReadonly();
  }

  login(email: string, password: string) {
    console.log('Email: ', email, 'Password: ', password)
    return this.http.post<loginResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap({
          next: response => {
            this._userId = response.userId;
            localStorage.setItem('userId', response.userId);
            this.isLoggedSignal.set(true);
          }
        })
      )
  }

  get userId(){
    return this._userId;
  }

  register(userData: User): Observable<RegisterResponse> {
    console.log(userData)
    return this.http.post<any>(`${this.baseUrl}/register`, userData);
  }

  logOut(){
    localStorage.removeItem('userId');
    this._userId = '';
    this.isLoggedSignal.set(false);
    this.router.navigateByUrl('/login')
  }
}
