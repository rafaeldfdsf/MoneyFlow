import { DTO_Card } from '@/shared/dtos/DTO_Card';
import { DTO_CardsPage } from '@/shared/dtos/DTO_CardsPage';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { environment } from 'src/environment';

@Injectable({ providedIn: 'root' })
export class CardsService {
    private readonly apiUrl = `${environment.apiUrl}/Cards`;

    constructor(private base: BaseHttpService) { }

    // Devolve a grelha de cartões já com métricas agregadas da página.
    getAll(): Observable<DTO_CardsPage | DTO_Card[] | null> {
        return this.base.getOne<DTO_CardsPage | DTO_Card[]>(`${this.apiUrl}/cards`);
    }

    // Carrega um cartão isolado para edição no formulário.
    getById(id: number): Observable<DTO_Card | null> {
        return this.base.getOne<DTO_Card>(`${this.apiUrl}/card/${id}`);
    }

    create(dto: DTO_Card): Observable<DTO_Card | null> {
        return this.base.post<DTO_Card, DTO_Card>(`${this.apiUrl}/card`, dto);
    }

    update(dto: DTO_Card): Observable<DTO_Card | null> {
        return this.base.put<DTO_Card, DTO_Card>(`${this.apiUrl}/card`, dto);
    }

    // Ativa cartões em lote a partir da seleção da grelha.
    activate(ids: number[]): Observable<boolean | null> {
        return this.base.put<number[], boolean>(`${this.apiUrl}/cards/activate`, ids);
    }

    // Desativa cartões em lote sem os remover da base de dados.
    deactivate(ids: number[]): Observable<boolean | null> {
        return this.base.put<number[], boolean>(`${this.apiUrl}/cards/deactivate`, ids);
    }

    delete(ids: number[]): Observable<boolean | null> {
        return this.base.post<number[], boolean>(`${this.apiUrl}/cards`, ids);
    }
}
