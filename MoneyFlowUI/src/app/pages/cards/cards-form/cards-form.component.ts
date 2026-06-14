import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { CardsService } from '@/services/Cards.service';
import { GenericDialogComponent } from '@/shared/components/generic-dialog/generic-dialog.component';
import { DTO_Card } from '@/shared/dtos/DTO_Card';
import { ToastService } from '@/shared/services/toast.service';

@Component({
    selector: 'app-cards-form',
    standalone: true,
    templateUrl: './cards-form.component.html',
    imports: [FormsModule, InputText, Button, Select, InputNumber, GenericDialogComponent]
})
export class CardsFormComponent {
    // Estado externo controlado pelo componente pai.
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Input() model!: DTO_Card;
    @Input() isEdit = false;
    @Input() idObject = 0;
    @Output() saveCard = new EventEmitter();
    @ViewChild(NgForm) form?: NgForm;

    // Estado interno de validação.
    isSubmitted = false;

    // Opções fixas do formulário.
    cardTypes = [
        { label: 'Débito', value: 'Debit' },
        { label: 'Crédito', value: 'Credit' }
    ];

    statusOptions = [
        { label: 'Ativo', value: true },
        { label: 'Inativo', value: false }
    ];

    constructor(
        private cardsService: CardsService,
        private toast: ToastService
    ) { }

    /**
     * Reconfigura o formulário sempre que o diálogo é aberto.
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

        this.loadCard();
    }

    /**
     * Exponibiliza uma flag simples para o template mostrar campos exclusivos de crédito.
     */
    get isCreditCard(): boolean {
        return this.model?.cardType === 'Credit';
    }

    /**
     * Inicializa um novo modelo com defaults seguros para criação.
     */
    private initNewModel() {
        this.model = {
            ...new DTO_Card(),
            ...this.model,
            cardType: this.model?.cardType ?? 'Debit',
            isActive: this.model?.isActive ?? true
        };

        this.onCardTypeChange(this.model.cardType);
    }

    /**
     * Carrega o cartão em edição e alinha o estado visual do formulário.
     */
    private loadCard() {
        this.cardsService.getById(this.idObject).subscribe({
            next: (data) => {
                if (!data) {
                    return;
                }

                this.model = data;
                this.onCardTypeChange(this.model.cardType, false);
                this.resetFormState();
            },
            error: (err) => console.error(err)
        });
    }

    /**
     * Limpa o estado de submissão para esconder erros antigos.
     */
    private resetSubmissionState() {
        this.isSubmitted = false;
    }

    /**
     * Faz reset ao `NgForm` depois de o modelo ter sido aplicado.
     */
    private resetFormState() {
        setTimeout(() => this.form?.resetForm(this.model));
    }

    /**
     * Propaga alterações de visibilidade vindas do diálogo genérico.
     */
    onDialogVisibleChange(value: boolean) {
        this.visible = value;
        this.visibleChange.emit(value);
    }

    /**
     * Limpa os campos exclusivos de crédito quando o cartão passa para débito.
     */
    onCardTypeChange(cardType: string, resetFields = true) {
        if (cardType !== 'Credit' && resetFields) {
            this.model.creditLimit = null;
            this.model.closingDay = null;
            this.model.dueDay = null;
        }
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
     * Valida e envia o formulário para criação ou edição.
     */
    save() {
        this.isSubmitted = true;

        if (!this.form || this.form.invalid) {
            this.toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        if (this.model.last4Digits && !/^\d{4}$/.test(this.model.last4Digits)) {
            this.toast.error('Os últimos 4 dígitos devem conter exatamente 4 números');
            return;
        }

        if (this.isCreditCard && (!this.model.closingDay || !this.model.dueDay)) {
            this.toast.error('Preencha os dias de fecho e pagamento para cartões de crédito');
            return;
        }

        if (this.isEdit) {
            this.cardsService.update(this.model).subscribe({
                next: (data) => {
                    if (!data) {
                        return;
                    }

                    this.toast.success('Atualizado com sucesso');
                    this.saveCard.emit(this.model);
                    this.close();
                },
                error: (err) => this.toast.error(err)
            });

            return;
        }

        this.cardsService.create(this.model).subscribe({
            next: (data) => {
                if (!data) {
                    return;
                }

                this.toast.success('Adicionado com sucesso');
                this.saveCard.emit(this.model);
                this.close();
            },
            error: (err) => this.toast.error(err)
        });
    }
}
