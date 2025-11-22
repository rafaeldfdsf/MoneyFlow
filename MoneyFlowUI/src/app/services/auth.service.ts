import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environment.development';
import { DTO_Login } from '@/shared/dtos/DTO_Login';
import { DTO_AuthResponse } from '@/shared/dtos/DTO_AuthResponse';
import { DTO_Register } from '@/shared/dtos/DTO_Register';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) { }

    login(dto: DTO_Login): Observable<DTO_AuthResponse> {
        return this.http.post<DTO_AuthResponse>(`${this.apiUrl}/login`, dto).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify({ name: response.name, email: response.email }));
            })
        );
    }

    register(dto: DTO_Register): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, dto);
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}