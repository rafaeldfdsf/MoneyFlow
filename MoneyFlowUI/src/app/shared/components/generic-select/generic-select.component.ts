import { HttpClient } from '@angular/common/http';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectModule } from "primeng/select";

@Component({
    selector: 'app-generic-select',
    standalone: true,
    imports: [FormsModule, SelectModule],
    templateUrl: './generic-select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GenericSelectComponent),
            multi: true
        }
    ]
})

export class GenericSelectComponent implements ControlValueAccessor, OnInit {
    /** Texto do label */
    @Input() label?: string;

    /** URL da API */
    @Input({ required: true }) apiUrl!: string;

    /** Propriedade para mostrar */
    @Input() optionLabel: string = 'label';

    /** Propriedade do valor */
    @Input() optionValue: string = 'value';

    /** Estado de loading */
    loading = false;

    /** Opções carregadas da API */
    options: any[] = [];

    /** Valor interno */
    value: any = null;

    /** Callbacks Angular Forms */
    private onChange = (_: any) => { };
    private onTouched = () => { };

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadOptions();
    }

    /** Carregar dados da API */
    loadOptions(): void {
        this.loading = true;

        this.http.get<any[]>(this.apiUrl).subscribe({
            next: data => {
                this.options = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    /** ControlValueAccessor */
    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setValue(value: any): void {
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }
}