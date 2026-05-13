import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TransactionsService } from '@/services/Transactions.service';
import { GenericDialogComponent } from '@/shared/components/generic-dialog/generic-dialog.component';
import { GenericSelectComponent } from '@/shared/components/generic-select/generic-select.component';
import { DTO_Transactions } from '@/shared/dtos/DTO_Transactions';
import { ToastService } from '@/shared/services/toast.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
  imports: [
    FormsModule,
    InputText,
    Button,
    Select,
    GenericDialogComponent,
    GenericSelectComponent
  ]
})
export class TransactionFormComponent {
  // Controla a visibilidade do diálogo.
  @Input() visible = false;

  // Emite alterações da visibilidade para o componente pai.
  @Output() visibleChange = new EventEmitter<boolean>();

  // Modelo da transação em criação ou edição.
  @Input() model!: DTO_Transactions;

  // Indica se o formulário está em modo de edição.
  @Input() isEdit = false;

  // ID da transação a editar.
  @Input() idObject = 0;

  // Evento emitido após criar ou atualizar uma transação com sucesso.
  @Output() saveTransaction = new EventEmitter();

  // Referência ao formulário para repor o estado visual ao abrir/fechar.
  @ViewChild(NgForm) form?: NgForm;

  // Marca se o utilizador já tentou guardar o formulário.
  isSubmitted = false;

  // Tipos disponíveis para o campo "Tipo".
  types = [
    { label: 'Entrada', value: true },
    { label: 'Saída', value: false }
  ];

  constructor(
    public transactionsService: TransactionsService,
    private toast: ToastService
  ) { }

  /**
   * Inicializa o diálogo e limpa estados de validação antigos
   * que possam ficar presos entre aberturas.
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

    this.loadTransaction();
  }

  /**
   * Inicializa um novo modelo para criação.
   */
  private initNewModel() {
    this.model = {
      ...new DTO_Transactions(),
      ...this.model,
      description: this.model?.description ?? '',
      amount: this.model?.amount ?? 0,
      isIncome: this.model?.isIncome ?? false,
      transactionDate: this.toDateInputValue(this.model?.transactionDate) as any
    };
  }

  /**
   * Carrega a transação em edição e repõe o estado visual do formulário.
   */
  private loadTransaction() {
    this.transactionsService.getById(this.idObject).subscribe({
      next: (data) => {
        if (!data) {
          return;
        }

        this.model = {
          ...data,
          transactionDate: this.toDateInputValue(data.transactionDate) as any
        };
        this.resetFormState();
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Normaliza a data para o formato esperado pelo input type="date".
   */
  private toDateInputValue(value?: Date | string | null): string {
    if (!value) {
      return new Date().toISOString().substring(0, 10);
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return new Date().toISOString().substring(0, 10);
    }

    return parsedDate.toISOString().substring(0, 10);
  }

  /**
   * Limpa o estado de submissão para voltar a esconder os erros.
   */
  private resetSubmissionState() {
    this.isSubmitted = false;
  }

  /**
   * Faz reset ao NgForm no ciclo seguinte para alinhar o estado interno
   * do Angular com o modelo acabado de carregar.
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

    const payload: DTO_Transactions = {
      ...this.model,
      transactionDate: this.toDateInputValue(this.model.transactionDate) as any
    };

    if (this.isEdit) {
      this.transactionsService.update(payload).subscribe({
        next: (data) => {
          if (!data) {
            return;
          }

          this.toast.success('Atualizado com sucesso');
          this.saveTransaction.emit(this.model);
          this.close();
        },
        error: (err) => this.toast.error(err)
      });

      return;
    }

    this.transactionsService.create(payload).subscribe({
      next: (data) => {
        if (!data) {
          return;
        }

        this.toast.success('Adicionado com sucesso');
        this.saveTransaction.emit(this.model);
        this.close();
      },
      error: (err) => this.toast.error(err)
    });
  }
}
