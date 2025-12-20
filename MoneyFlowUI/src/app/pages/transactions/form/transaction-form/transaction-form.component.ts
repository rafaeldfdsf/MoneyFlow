import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG (Standalone Components usados no HTML)
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';

// O teu diálogo genérico
import { GenericDialogComponent } from '@/shared/components/generic-dialog/generic-dialog.component';
import { DTO_Transactions } from '@/shared/dtos/DTO_Transactions';
import { TransactionsService } from '@/services/Transactions.service';

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
    GenericDialogComponent
  ]
})
export class TransactionFormComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() model!: DTO_Transactions;
  @Input() isEdit = false;
  @Input() idObject = 0;

  @Output() saveTransaction = new EventEmitter<any>();

  types = [
    { label: 'Entrada', value: true },
    { label: 'Saída', value: false }
  ];

  constructor(private transactionsService: TransactionsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {

      if (!this.isEdit) {
        // CREATE
        this.initNewModel();
      } else {
        // EDIT
        this.loadTransaction();
      }
    }
  }

  private initNewModel() {
    this.model = new DTO_Transactions();
  }


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

  /** recebe mudança do dialog genérico */
  onDialogVisibleChange(value: boolean) {
    this.visible = value;
    this.visibleChange.emit(value);
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  save() {
    this.saveTransaction.emit(this.model);
    this.close();
  }
}
