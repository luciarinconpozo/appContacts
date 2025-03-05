import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { loginResponse, RegisterResponse, User } from '../../shared/interfaces/auth';
import { ContactsService } from '../../contacts/services/contacts.service';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

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

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }

  validateToken(){
    const url = `${this.baseUrl}/verify`;
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`);

      return this.http.get<loginResponse>(url, {headers})
      .pipe(
        map( resp => {
          // Aquí deberíamos guardar la información del usuario
          return true;
        }),
        catchError(err => of(false))
      )

  }

  get isLogged() {
    return this.isLoggedSignal.asReadonly();
  }

  isLoggedF(): boolean{
    if (this.isLogged()){
      return true;
    }
    else{
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  login(email: string, password: string) {
    
    return this.http.post<loginResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap({
          next: response => {
            const token = this.getDecodedAccessToken(response.token);
            console.log('Token:' , token)
            this._userId = token.userId;
            localStorage.setItem('userId', token.userId)
            localStorage.setItem('token', response.token);
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
