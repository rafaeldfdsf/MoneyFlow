import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenericDialogComponent } from '@/shared/components/generic-dialog/generic-dialog.component';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-transaction-form',
  imports: [FormsModule, InputTextModule, SelectModule, ButtonModule, GenericDialogComponent],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})

export class TransactionFormComponent {
  @Input() visible = false;
  @Input() model: any = {};
  @Input() isEdit = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saveTransaction = new EventEmitter<any>();

  types = [
    { label: 'Entrada', value: true },
    { label: 'Saída', value: false }
  ];

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  save() {
    this.saveTransaction.emit(this.model);
    this.close();
  }

  onDialogVisibleChange(v: boolean) {
    this.visible = v;
    this.visibleChange.emit(v);
  }
}
