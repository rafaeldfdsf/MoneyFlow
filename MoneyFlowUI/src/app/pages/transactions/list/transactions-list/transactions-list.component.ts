import { Component, Injector, signal } from '@angular/core';
import { Toolbar } from "primeng/toolbar";
import { Button } from "primeng/button";
import { GenericTableComponent } from "@/shared/components/generic-table/generic-table";
import { DTO_Transactions } from '@/shared/dtos/DTO_Transactions';
import { TransactionsService } from '@/services/Transactions.service';
import { TableColumnDefinition } from '@/shared/models/table-column.model';
import { TransactionFormComponent } from '../../form/transaction-form/transaction-form.component';

@Component({
  selector: 'app-transactions-list',
  imports: [Toolbar, Button, GenericTableComponent, TransactionFormComponent],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss'
})

export class TransactionsListComponent {
  // Lista de transações (dados vindos do backend)
  transactions = signal<DTO_Transactions[]>([]);
  loading = signal(false);
  selectedCustomer: any;
  dialogInjector!: Injector;

  selectedTransaction: any = {};
  isEdit = false;
  dialogVisible = false;

  selectedTransactions: DTO_Transactions[] = [];

  // Definição das colunas da tabela
  columns: TableColumnDefinition<DTO_Transactions>[] = [
    // { field: 'id', header: 'ID', sortable: true, width: '80px', align: 'center' },
    { field: 'description', header: 'Descrição', sortable: true },
    { field: 'amount', header: 'Valor (€)', type: 'currency', sortable: true, align: 'right' },
    { field: 'isIncome', header: 'Tipo', type: 'boolean', sortable: true, width: '100px', align: 'center' },
    { field: 'transactionDate', header: 'Data', type: 'date', sortable: true, width: '140px' },
    {
      field: 'actions',
      header: 'Ações',
      align: 'center',
      width: '120px',
      actions: [
        { icon: 'pi pi-pencil', onClick: (row: DTO_Transactions) => this.edit(row) },
        { icon: 'pi pi-trash', class: 'p-button-danger', onClick: (row: DTO_Transactions) => this.remove(row) }
      ]
    }
  ];

  constructor(private transactionsService: TransactionsService, private injectorFactory: Injector) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  // Método para buscar as transações do backend
  loadTransactions(): void {
    this.loading.set(true);
    this.transactionsService.getAll().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro:', err);
        this.loading.set(false);
      }
    });
  }


  onRowClick(row: any) {
    this.selectedCustomer = row;

    this.dialogInjector = Injector.create({
      providers: [
        { provide: 'model', useValue: row }
      ],
      parent: this.injectorFactory
    });

    this.dialogVisible = true;
  }

  edit(row: any) {
    this.isEdit = true;
    this.selectedTransaction = { ...row };
    this.dialogVisible = true;
  }

  remove(row: any) {
    console.log('Remover:', row);
  }

  openNew() {
    this.isEdit = false;
    this.selectedTransaction = {
      description: '',
      amount: 0,
      isIncome: false,
      transactionDate: new Date().toISOString().substring(0, 10)
    };
    this.dialogVisible = true;
  }

  openEdit() {
    this.isEdit = false;
    this.selectedTransaction = {
      description: '',
      amount: 0,
      isIncome: false,
      transactionDate: new Date().toISOString().substring(0, 10)
    };
    this.dialogVisible = true;
  }

  deleteSelectedProducts() {

  }

  exportCSV() {

  }

  onSave(transaction: any) {
    this.loading.set(true);
    this.transactionsService.create(transaction).subscribe({
      next: (data) => {
        if (data) {
          this.transactions.update(list => [...list, data]);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro:', err);
        this.loading.set(false);
      }
    });
  }

  onSelectionChange(rows: DTO_Transactions[]) {
    this.selectedTransactions = rows;
    console.log('Selecionadas:', rows);
  }
}
