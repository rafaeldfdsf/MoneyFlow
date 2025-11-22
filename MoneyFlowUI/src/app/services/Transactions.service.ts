import { DTO_Transactions } from '@/shared/dtos/DTO_Transactions';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';

@Injectable({ providedIn: 'root' })
export class TransactionsService {

    private apiUrl = 'https://localhost:7085/api/transactions';

    constructor(private base: BaseHttpService) { }

    getAll(): Observable<DTO_Transactions[]> {
        return this.base.getList<DTO_Transactions>(this.apiUrl);
    }

    getById(id: number): Observable<DTO_Transactions | null> {
        return this.base.getOne<DTO_Transactions>(`${this.apiUrl}/${id}`);
    }

    create(dto: DTO_Transactions): Observable<DTO_Transactions | null> {
        return this.base.post<DTO_Transactions, DTO_Transactions>(this.apiUrl, dto);
    }

    update(id: number, dto: DTO_Transactions): Observable<DTO_Transactions | null> {
        return this.base.put<DTO_Transactions, DTO_Transactions>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<boolean | null> {
        return this.base.delete<boolean>(`${this.apiUrl}/${id}`);
    }
}
