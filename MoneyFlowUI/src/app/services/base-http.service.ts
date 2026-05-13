import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DTO_ResponseTable } from '@/shared/dtos/DTO_ResponseTable';

@Injectable({ providedIn: 'root' })
export class BaseHttpService {
    constructor(private http: HttpClient) { }

    getList<T>(url: string): Observable<T[]> {
        return this.http.get<DTO_ResponseTable<T[]>>(url).pipe(
            map((res) => this.unwrapResponse<T[]>(res, []))
        );
    }

    getOne<T>(url: string): Observable<T | null> {
        return this.http.get<DTO_ResponseTable<T>>(url).pipe(
            map((res) => this.unwrapResponse<T | null>(res, null))
        );
    }

    post<TBody, TResponse>(url: string, body: TBody): Observable<TResponse | null> {
        return this.http.post<DTO_ResponseTable<TResponse>>(url, body).pipe(
            map((res) => this.unwrapResponse<TResponse | null>(res, null))
        );
    }

    put<TBody, TResponse>(url: string, body: TBody): Observable<TResponse | null> {
        return this.http.put<DTO_ResponseTable<TResponse>>(url, body).pipe(
            map((res) => this.unwrapResponse<TResponse | null>(res, null))
        );
    }

    delete<TResponse>(url: string): Observable<TResponse | null> {
        return this.http.delete<DTO_ResponseTable<TResponse>>(url).pipe(
            map((res) => this.unwrapResponse<TResponse | null>(res, null))
        );
    }

    private unwrapResponse<T>(response: DTO_ResponseTable<T>, fallback: T): T {
        if (response.success) {
            return response.data ?? fallback;
        }

        throw new Error(response.message || 'O pedido falhou.');
    }
}
