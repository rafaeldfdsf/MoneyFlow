import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { GenericDialogComponent } from '@/shared/components/generic-dialog/generic-dialog.component';
import { DTO_Transactions } from '@/shared/dtos/DTO_Transactions';
import { TransactionsService } from '@/services/Transactions.service';
import { ToastService } from '@/shared/services/toast.service';
import { GenericSelectComponent } from "@/shared/components/generic-select/generic-select.component";
import { environment } from 'src/environment.development';

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

  // Controla a visibilidade do dialog
  @Input() visible = false;

  // Emite alterações da visibilidade para o componente pai
  @Output() visibleChange = new EventEmitter<boolean>();

  // Modelo da transação (criação ou edição)
  @Input() model!: DTO_Transactions;

  // Indica se o formulário está em modo edição
  @Input() isEdit = false;

  // ID da transação a editar
  @Input() idObject = 0;

  // Evento emitido após criar ou atualizar uma transação com sucesso
  @Output() saveTransaction = new EventEmitter();

  categoryUrl = `${environment.apiUrl}/Category/categories`;

  isFormValid = false;
  isSubmitted = false;

  // Tipos disponíveis para o campo "tipo"(entrada ou saída)
  types = [
    { label: 'Entrada', value: true },
    { label: 'Saída', value: false }
  ];

  constructor(
    public transactionsService: TransactionsService,
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
    this.model = new DTO_Transactions();
  }

  /**
   * Carrega o registo usando o ID recebido por input
   */
  private loadTransaction() {
    this.transactionsService.getById(this.idObject).subscribe({
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
    if (!this.isFormValid) {
      this.toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (this.isEdit) {
      this.transactionsService.update(this.model).subscribe({
        next: (data) => {
          if (data) {
            this.toast.success("Atualizado com sucesso");
            this.saveTransaction.emit(this.model);
            this.close();
          }
        },
        error: (err) => this.toast.error(err)
      });
    }
    else {
      this.transactionsService.create(this.model).subscribe({
        next: (data) => {
          if (data) {
            this.toast.success("Adicionado com sucesso");
            this.saveTransaction.emit(this.model);
            this.close();
          }
        },
        error: (err) => this.toast.error(err)
      });
    }
  }
}