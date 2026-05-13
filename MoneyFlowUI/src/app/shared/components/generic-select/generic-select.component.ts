import { HttpClient } from '@angular/common/http';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { environment } from 'src/environment';

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
    // Texto apresentado no label do componente.
    @Input() label?: string;

    // URL relativa da API usada para carregar as opções.
    @Input({ required: true }) apiUrl!: string;

    // Propriedade usada para apresentar o texto da opção.
    @Input() optionLabel = 'label';

    // Propriedade usada como valor interno da opção.
    @Input() optionValue = 'value';

    // Estado inválido vindo do formulário pai para styling visual.
    @Input() invalid = false;

    // Estado de carregamento do select.
    loading = false;

    // Lista de opções carregadas da API.
    options: any[] = [];

    // Valor interno sincronizado com o formulário pai.
    value: any = null;

    // Estado disabled propagado pelo Angular Forms.
    disabled = false;

    // Callbacks do ControlValueAccessor.
    private onChange = (_: any) => { };
    private onTouched = () => { };

    constructor(private http: HttpClient) { }

    /**
     * Carrega as opções ao iniciar o componente.
     */
    ngOnInit(): void {
        this.loadOptions();
    }

    /**
     * Carrega os dados da API para popular o select.
     */
    loadOptions(): void {
        this.loading = true;

        this.http.get<any[]>(`${environment.apiUrl}/${this.apiUrl}`).subscribe({
            next: (data) => {
                this.options = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    /**
     * Recebe o valor vindo do formulário pai.
     */
    writeValue(value: any): void {
        this.value = value;
    }

    /**
     * Regista o callback de alteração do Angular Forms.
     */
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Regista o callback de toque do Angular Forms.
     */
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Atualiza o estado disabled do componente.
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Propaga a nova seleção para o formulário pai e marca o campo como touched.
     */
    setValue(value: any): void {
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }
}
