import { Component, Injector, signal } from '@angular/core';
import { Toolbar } from "primeng/toolbar";
import { Button } from "primeng/button";
import { GenericTableComponent } from "@/shared/components/generic-table/generic-table";
import { DTO_Transactions } from '@/shared/dtos/DTO_Transactions';
import { TransactionsService } from '@/services/Transactions.service';
import { TableColumnDefinition } from '@/shared/models/table-column.model';
import { TransactionFormComponent } from '../../form/transaction-form/transaction-form.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from "primeng/confirmdialog";

@Component({
  selector: 'app-transactions-list',
  imports: [Toolbar, Button, GenericTableComponent, TransactionFormComponent, ConfirmDialog],
  providers: [ConfirmationService],
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
  SelectedRowId = 0;

  // Definição das colunas da tabela
  columns: TableColumnDefinition<DTO_Transactions>[] = [
    { field: 'description', header: 'Descrição', sortable: true },
    { field: 'amount', header: 'Valor (€)', type: 'currency', sortable: true, align: 'right' },
    { field: 'isIncome', header: 'Tipo', type: 'boolean', sortable: true, width: '100px', align: 'center' },
    { field: 'transactionDate', header: 'Data', type: 'date', sortable: true, width: '140px' }
    // {
    //   field: 'actions',
    //   header: 'Ações',
    //   align: 'center',
    //   width: '120px',
    //   actions: [
    //     { icon: 'pi pi-pencil', onClick: (row: DTO_Transactions) => this.edit(row) },
    //     { icon: 'pi pi-trash', class: 'p-button-danger', onClick: (row: DTO_Transactions) => this.remove(row) }
    //   ]
    // }
  ];

  constructor(
    private transactionsService: TransactionsService,
    private injectorFactory: Injector,
    private confirmationService: ConfirmationService
  ) { }

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


  onRowClick(row: DTO_Transactions) {
    this.isEdit = true;
    this.selectedCustomer = row;
    this.SelectedRowId = row.id;

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
    this.isEdit = true;
    this.selectedTransaction = {
      description: '',
      amount: 0,
      isIncome: false,
      transactionDate: new Date().toISOString().substring(0, 10)
    };
    this.dialogVisible = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      header: 'Confirmar Eliminação',
      message: 'Tem a certeza de que pretende eliminar os itens selecionados?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.transactionsService.delete(this.selectedTransactions.map(i => i.id)).subscribe({
          next: (data) => {
            this.loadTransactions();
            this.selectedTransactions = [];
          },
          error: (err) => {
            console.error('Erro:', err);
          }
        });
      }
    });
  }

  exportCSV() {

  }

  onSave(transaction: any) {
    this.loading.set(true);
    this.transactionsService.create(transaction).subscribe({
      next: (data) => {
        if (data) {
          this.loadTransactions();
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
