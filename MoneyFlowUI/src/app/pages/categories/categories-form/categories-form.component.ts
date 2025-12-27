import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { GenericDialogComponent } from '@/shared/components/generic-dialog/generic-dialog.component';
import { DTO_Category } from '@/shared/dtos/DTO_Category';
import { ToastService } from '@/shared/services/toast.service';
import { CategoriesService } from '@/services/Categories.service';

@Component({
    selector: 'app-categories-form',
    standalone: true,
    templateUrl: './categories-form.component.html',
    imports: [
        FormsModule,
        InputText,
        Button,
        GenericDialogComponent
    ]
})

export class CategoriesFormComponent {

    // Controla a visibilidade do dialog
    @Input() visible = false;

    // Emite alterações da visibilidade para o componente pai
    @Output() visibleChange = new EventEmitter<boolean>();

    // Modelo da transação (criação ou edição)
    @Input() model!: DTO_Category;

    // Indica se o formulário está em modo edição
    @Input() isEdit = false;

    // ID da transação a editar
    @Input() idObject = 0;

    // Evento emitido após criar ou atualizar uma transação com sucesso
    @Output() saveCategory = new EventEmitter();

    isFormValid = false;
    isSubmitted = false;

    constructor(
        private categoriesService: CategoriesService,
        private toast: ToastService
    ) { }

    /**
     * Inicializa o dialog
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {

            this.isSubmitted = false;
            this.isFormValid = false;

            if (!this.isEdit) {
                // CREATE
                this.initNewModel();
            } else {
                // EDIT
                this.loadTransaction();
            }
        }
    }

    /**
     * Inicializa um novo modelo
     */
    private initNewModel() {
        this.model = new DTO_Category();
    }

    /**
     * Carrega o registo usando o ID recebido por input
     */
    private loadTransaction() {
        this.categoriesService.getById(this.idObject).subscribe({
            next: (data) => {
                if (!data) {
                    return;
                }
                this.model = data;
            },
            error: (err) => console.error(err)
        });
    }

    /**
     * Recebe alterações de visibilidade vindas do diálogo genérico
     */
    onDialogVisibleChange(value: boolean) {
        this.visible = value;
        this.visibleChange.emit(value);
    }

    /**
     * Fecha o diálogo e notifica o componente pai
     */
    close() {
        this.visible = false;
        this.visibleChange.emit(false);

        this.isSubmitted = false;
        this.isFormValid = false;
    }

    /**
     * Guarda o registo (Create or Update)
     */
    save() {
        this.isSubmitted = true;
        // if (!this.isFormValid) {
        //     this.toast.error('Preencha todos os campos obrigatórios');
        //     return;
        // }

        if (this.isEdit) {
            this.categoriesService.update(this.model).subscribe({
                next: (data) => {
                    if (data) {
                        this.toast.success("Atualizado com sucesso");
                        this.saveCategory.emit(this.model);
                        this.close();
                    }
                },
                error: (err) => this.toast.error(err)
            });
        }
        else {
            this.categoriesService.create(this.model).subscribe({
                next: (data) => {
                    if (data) {
                        this.toast.success("Adicionado com sucesso");
                        this.saveCategory.emit(this.model);
                        this.close();
                    }
                },
                error: (err) => this.toast.error(err)
            });
        }
    }
}