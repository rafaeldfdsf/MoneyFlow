import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DTO_ResponseTable } from '@/shared/dtos/DTO_ResponseTable';

@Injectable({ providedIn: 'root' })
export class BaseHttpService {
    constructor(private http: HttpClient) { }

    getList<T>(url: string): Observable<T[]> {
        return this.http.get<DTO_ResponseTable<T[]>>(url).pipe(
            map(res => res.success ? res.data ?? [] : []),
            catchError(err => {
                console.error('Erro GET LIST:', err);
                return of([] as T[]);
            })
        );
    }

    getOne<T>(url: string): Observable<T | null> {
        return this.http.get<DTO_ResponseTable<T>>(url).pipe(
            map(res => res.success ? res.data ?? null : null),
            catchError(err => {
                console.error('Erro GET ONE:', err);
                return of(null);
            })
        );
    }

    post<TBody, TResponse>(url: string, body: TBody): Observable<TResponse | null> {
        return this.http.post<DTO_ResponseTable<TResponse>>(url, body).pipe(
            map(res => res.success ? res.data ?? null : null),
            catchError(err => {
                console.error('Erro POST:', err);
                return of(null);
            })
        );
    }

    put<TBody, TResponse>(url: string, body: TBody): Observable<TResponse | null> {
        return this.http.put<DTO_ResponseTable<TResponse>>(url, body).pipe(
            map(res => res.success ? res.data ?? null : null),
            catchError(err => {
                console.error('Erro PUT:', err);
                return of(null);
            })
        );
    }

    delete<TResponse>(url: string): Observable<TResponse | null> {
        return this.http.delete<DTO_ResponseTable<TResponse>>(url).pipe(
            map(res => res.success ? res.data ?? null : null),
            catchError(err => {
                console.error('Erro DELETE:', err);
                return of(null);
            })
        );
    }
}