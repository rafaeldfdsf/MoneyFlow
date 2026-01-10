import { Component, Injector, signal, TemplateRef, ViewChild } from '@angular/core';
import { Toolbar } from "primeng/toolbar";
import { Button } from "primeng/button";
import { GenericTableComponent } from "@/shared/components/generic-table/generic-table";
import { DTO_Transactions } from '@/shared/dtos/DTO_Transactions';
import { TransactionsService } from '@/services/Transactions.service';
import { TableColumnDefinition } from '@/shared/models/table-column.model';
import { TransactionFormComponent } from '../../form/transaction-form/transaction-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from "primeng/confirmdialog";
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { Toast } from "primeng/toast";
import { ToastService } from '@/shared/services/toast.service';
import { UserBalanceService } from '@/services/UserBalance.service';
import { DTO_UserBalance } from '@/shared/dtos/DTO_UserBalance';

@Component({
  selector: 'app-transactions-list',
  imports: [Toolbar, Button, GenericTableComponent, TransactionFormComponent, ConfirmDialog, CommonModule, MessageModule, Toast],
  providers: [ConfirmationService, MessageService],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss'
})

export class TransactionsListComponent {
  // Lista de transações (dados vindos do backend)
  transactions = signal<DTO_Transactions[]>([]);

  // Saldo Atual (dados vindos do backend)
  userBalance = signal<number | 0>(0);

  // Controla o estado de loading (spinner)
  loading = signal(false);

  // Guarda a linha atualmente selecionada
  selectedCustomer: any;

  // Injector usado para passar dados dinamicamente para o componente do formulário (edit)
  dialogInjector!: Injector;

  // Transação atualmente em edição/criação
  selectedTransaction: any = {};

  // Flag para distinguir entre criar ou editar
  isEdit = false;

  // Controla a visibilidade do diálogo (form)
  dialogVisible = false;

  // Lista de transações selecionadas
  selectedTransactions: DTO_Transactions[] = [];

  // ID da linha atualmente selecionada
  SelectedRowId = 0;

  // Template personalizado para a coluna "amount"
  @ViewChild('amountTemplate', { static: true })
  amountTemplate!: TemplateRef<any>;

  // Definição das colunas da tabela
  columns: TableColumnDefinition<DTO_Transactions>[] = [];

  /**
   * Colunas da tabela
   */
  ngAfterViewInit() {
    // Definição das colunas da tabela
    this.columns = [
      { field: 'description', header: 'Descrição', sortable: true },
      { field: 'amount', header: 'Valor (€)', type: 'currency', sortable: true, align: 'right', template: this.amountTemplate },
      { field: 'type', header: 'Tipo', type: 'text', sortable: true, width: '100px', align: 'center' },
      { field: 'transactionDate', header: 'Data', type: 'date', sortable: true, width: '140px' }
    ];
  }

  constructor(
    private transactionsService: TransactionsService,
    private userBalanceService: UserBalanceService,
    private injectorFactory: Injector,
    private confirmationService: ConfirmationService,
    private toast: ToastService
  ) { }

  /**
   * Carrega os dados iniciais
   */
  ngOnInit(): void {
    this.loadTransactions();
  }

  /**
   * Método para ir buscar os registos para a grid
   */
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

    this.userBalanceService.get().subscribe({
      next: (data) => {
        this.userBalance.set(data?.currentBalance ?? 0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro:', err);
        this.loading.set(false);
      }
    });
  }

  /**
   * Executa quando o utilizador clica numa linha da tabela.
   * Abre o diálogo em modo edição.
   */
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

  /**
   * Abre o diálogo para criar um novo registo
   */
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

  /**
   * Abre um diálogo de confirmação e elimina as transações selecionadas
   */
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
            this.toast.success("Eliminado com sucesso");
            this.loadTransactions();
            this.selectedTransactions = [];
          },
          error: (err) => {
            this.toast.error(err);
          }
        });
      }
    });
  }

  /**
   * Atualiza a lista de linhas selecionadas na tabela.
   */
  onSelectionChange(rows: DTO_Transactions[]) {
    this.selectedTransactions = rows;
  }
}