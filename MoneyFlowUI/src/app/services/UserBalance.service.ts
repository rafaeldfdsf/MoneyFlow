import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { environment } from 'src/environment';
import { DTO_UserBalance } from '@/shared/dtos/DTO_UserBalance';

@Injectable({ providedIn: 'root' })
export class UserBalanceService {

    private readonly apiUrl = `${environment.apiUrl}/UserBalance`;

    constructor(private base: BaseHttpService) { }

    get(): Observable<DTO_UserBalance | null> {
        return this.base.getOne<DTO_UserBalance>(`${this.apiUrl}/userBalance`);
    }
}
