import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG (Standalone Components usados no HTML)
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';

// O teu diálogo genérico
import { GenericDialogComponent } from '@/shared/components/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
  imports: [
    FormsModule,
    // PrimeNG standalone components
    InputText,
    Button,
    Select,
    // O TEU DIALOGO GENÉRICO
    GenericDialogComponent
  ]
})
export class TransactionFormComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() model: any = {};
  @Input() isEdit = false;

  @Output() saveTransaction = new EventEmitter<any>();

  types = [
    { label: 'Entrada', value: true },
    { label: 'Saída', value: false }
  ];

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
