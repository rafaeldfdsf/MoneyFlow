import { DTO_Category } from '@/shared/dtos/DTO_Category';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { environment } from 'src/environment.development';

@Injectable({ providedIn: 'root' })
export class CategoriesService {

    private readonly apiUrl = `${environment.apiUrl}/Category`;

    constructor(private base: BaseHttpService) { }

    getAll(): Observable<DTO_Category[]> {
        return this.base.getList<DTO_Category>(`${this.apiUrl}/categories`);
    }

    getById(id: number): Observable<DTO_Category | null> {
        return this.base.getOne<DTO_Category>(`${this.apiUrl}/category/${id}`);
    }

    create(dto: DTO_Category): Observable<DTO_Category | null> {
        return this.base.post<DTO_Category, DTO_Category>(`${this.apiUrl}/category`, dto);
    }

    update(dto: DTO_Category): Observable<DTO_Category | null> {
        return this.base.put<DTO_Category, DTO_Category>(`${this.apiUrl}/category`, dto);
    }

    delete(ids: number[]): Observable<boolean | null> {
        return this.base.post<number[], boolean>(`${this.apiUrl}/categories`, ids);
    }
}