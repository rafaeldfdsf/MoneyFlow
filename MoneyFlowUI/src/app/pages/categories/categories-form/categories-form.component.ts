import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { CategoriesService } from '@/services/Categories.service';
import { GenericDialogComponent } from '@/shared/components/generic-dialog/generic-dialog.component';
import { DTO_Category } from '@/shared/dtos/DTO_Category';
import { ToastService } from '@/shared/services/toast.service';

@Component({
    selector: 'app-categories-form',
    standalone: true,
    templateUrl: './categories-form.component.html',
    imports: [FormsModule, InputText, Button, GenericDialogComponent]
})
export class CategoriesFormComponent {
    // Controla a visibilidade do diálogo.
    @Input() visible = false;

    // Emite alterações da visibilidade para o componente pai.
    @Output() visibleChange = new EventEmitter<boolean>();

    // Modelo da categoria em criação ou edição.
    @Input() model!: DTO_Category;

    // Indica se o formulário está em modo de edição.
    @Input() isEdit = false;

    // ID da categoria a editar.
    @Input() idObject = 0;

    // Evento emitido após criar ou atualizar uma categoria com sucesso.
    @Output() saveCategory = new EventEmitter();

    // Referência ao formulário para limpar estados de validação entre aberturas.
    @ViewChild(NgForm) form?: NgForm;

    // Marca se o utilizador já tentou guardar o formulário.
    isSubmitted = false;

    constructor(
        private categoriesService: CategoriesService,
        private toast: ToastService
    ) { }

    /**
     * Inicializa o diálogo e garante que os estados de validação
     * não ficam presos entre uma abertura e a seguinte.
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue !== true) {
            return;
        }

        this.resetSubmissionState();

        if (!this.isEdit) {
            this.initNewModel();
            this.resetFormState();
            return;
        }

        this.loadCategory();
    }

    /**
     * Inicializa um novo modelo para criação.
     */
    private initNewModel() {
        this.model = new DTO_Category();
    }

    /**
     * Carrega a categoria em edição e repõe o estado visual do formulário.
     */
    private loadCategory() {
        this.categoriesService.getById(this.idObject).subscribe({
            next: (data) => {
                if (!data) {
                    return;
                }

                this.model = data;
                this.resetFormState();
            },
            error: (err) => console.error(err)
        });
    }

    /**
     * Limpa o estado de submissão para esconder os erros
     * até à próxima tentativa de guardar.
     */
    private resetSubmissionState() {
        this.isSubmitted = false;
    }

    /**
     * Faz reset ao NgForm depois do Angular aplicar o modelo,
     * evitando que os campos abram logo marcados como inválidos.
     */
    private resetFormState() {
        setTimeout(() => this.form?.resetForm(this.model));
    }

    /**
     * Recebe alterações de visibilidade vindas do diálogo genérico.
     */
    onDialogVisibleChange(value: boolean) {
        this.visible = value;
        this.visibleChange.emit(value);
    }

    /**
     * Fecha o diálogo e limpa o estado visual do formulário.
     */
    close() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.resetSubmissionState();
        this.form?.resetForm(this.model);
    }

    /**
     * Guarda o registo apenas quando o formulário está válido.
     */
    save() {
        this.isSubmitted = true;

        if (!this.form || this.form.invalid) {
            this.toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        if (this.isEdit) {
            this.categoriesService.update(this.model).subscribe({
                next: (data) => {
                    if (!data) {
                        return;
                    }

                    this.toast.success('Atualizado com sucesso');
                    this.saveCategory.emit(this.model);
                    this.close();
                },
                error: (err) => this.toast.error(err)
            });

            return;
        }

        this.categoriesService.create(this.model).subscribe({
            next: (data) => {
                if (!data) {
                    return;
                }

                this.toast.success('Adicionado com sucesso');
                this.saveCategory.emit(this.model);
                this.close();
            },
            error: (err) => this.toast.error(err)
        });
    }
}
