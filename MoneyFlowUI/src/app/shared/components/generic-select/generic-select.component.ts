import { BaseHttpService } from '@/services/base-http.service';
import { DTO_SelectOption } from '@/shared/dtos/DTO_SelectOption';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { map, Observable } from 'rxjs';

@Component({
    selector: 'app-generic-select',
    standalone: true,
    imports: [FormsModule, SelectModule],
    templateUrl: './generic-select.component.html'
})

export class GenericSelectComponent<T = any> implements OnInit {
    private baseHttp = inject(BaseHttpService);

    // UI
    @Input() label?: string;
    @Input() placeholder = 'Select';

    // API
    @Input() apiUrl!: string;

    // Mapping
    @Input({ required: true }) optionLabel!: string;
    @Input({ required: true }) optionValue!: string;

    // Value (two-way binding)
    @Input() value!: any;
    @Output() valueChange = new EventEmitter<any>();

    // State
    options = signal<DTO_SelectOption[]>([]);
    loading = signal(false);

    ngOnInit(): void {
        if (!this.apiUrl) {
            console.error('GenericSelect: apiUrl é obrigatório');
            return;
        }

        this.loadData();
    }

    private loadData(): void {
        this.loading.set(true);

        this.baseHttp.getList<any>(this.apiUrl).pipe(
            map(data =>
                data.map(item => ({
                    value: item[this.optionValue],
                    label: item[this.optionLabel]
                }))
            )
        ).subscribe({
            next: (options) => {
                this.options.set(options);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}