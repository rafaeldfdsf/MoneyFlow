import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';
import { BaseHttpService } from './base-http.service';
import { DTO_Dashboard } from '@/shared/dtos/DTO_Dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private readonly apiUrl = `${environment.apiUrl}/Dashboard`;

    constructor(private base: BaseHttpService) { }

    get(): Observable<DTO_Dashboard | null> {
        return this.base.getOne<DTO_Dashboard>(`${this.apiUrl}/dashboard`);
    }
}
