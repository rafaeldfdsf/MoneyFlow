import { CommonModule } from '@angular/common';
import { Component, Injector, signal, TemplateRef, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { Toast } from 'primeng/toast';
import { TransactionsService } from '@/services/Transactions.service';
import { GenericTableComponent } from '@/shared/components/generic-table/generic-table';
import { TableColumnDefinition } from '@/shared/models/table-column.model';
import { ToastService } from '@/shared/services/toast.service';
import { DTO_Transactions } from '@/shared/dtos/DTO_Transactions';
import { TransactionFormComponent } from '../../form/transaction-form/transaction-form.component';

@Component({
  selector: 'app-transactions-list',
  imports: [Button, GenericTableComponent, TransactionFormComponent, ConfirmDialog, CommonModule, MessageModule, Toast],
  providers: [ConfirmationService, MessageService],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss'
})
export class TransactionsListComponent {
  // Lista de transações vindas do backend.
  transactions = signal<DTO_Transactions[]>([]);

  // Saldo atual do utilizador.
  userBalance = signal<number | 0>(0);

  // Total de entradas do mês atual.
  monthlyIncome = signal<number | 0>(0);

  // Total de saídas do mês atual.
  monthlyExpense = signal<number | 0>(0);

  // Fluxo líquido do mês atual.
  netFlow = signal<number | 0>(0);

  // Número total de transações.
  totalTransactionsCount = signal(0);

  // Número de transações do mês atual.
  monthlyTransactionsCount = signal(0);

  // Controla o estado de loading.
  loading = signal(false);

  // Guarda a linha atualmente selecionada.
  selectedCustomer: any;

  // Injector usado para passar dados dinamicamente para o formulário.
  dialogInjector!: Injector;

  // Transação atualmente em edição/criação.
  selectedTransaction: any = {};

  // Flag para distinguir entre criar ou editar.
  isEdit = false;

  // Controla a visibilidade do diálogo.
  dialogVisible = false;

  // Lista de transações selecionadas.
  selectedTransactions: DTO_Transactions[] = [];

  // ID da linha atualmente selecionada.
  SelectedRowId = 0;

  // Template personalizado para a coluna "amount".
  @ViewChild('amountTemplate', { static: true })
  amountTemplate!: TemplateRef<any>;

  // Definição das colunas da tabela.
  columns: TableColumnDefinition<DTO_Transactions>[] = [];

  /**
   * Colunas da tabela.
   */
  ngAfterViewInit() {
    this.columns = [
      { field: 'description', header: 'Descrição', sortable: true },
      { field: 'amount', header: 'Valor (€)', type: 'currency', sortable: true, align: 'right', template: this.amountTemplate },
      { field: 'type', header: 'Tipo', type: 'text', sortable: true, width: '110px', align: 'center' },
      { field: 'transactionDate', header: 'Data', type: 'date', sortable: true, width: '140px' }
    ];
  }

  constructor(
    private transactionsService: TransactionsService,
    private injectorFactory: Injector,
    private confirmationService: ConfirmationService,
    private toast: ToastService
  ) { }

  /**
   * Carrega os dados iniciais.
   */
  ngOnInit(): void {
    this.loadTransactions();
  }

  /**
   * Vai buscar os registos para a grelha e os indicadores da página.
   */
  loadTransactions(): void {
    this.loading.set(true);

    this.transactionsService.getAll().subscribe({
      next: (data) => {
        this.transactions.set(data?.transactions ?? []);
        this.userBalance.set(data?.currentBalance ?? 0);
        this.monthlyIncome.set(data?.monthlyIncome ?? 0);
        this.monthlyExpense.set(data?.monthlyExpense ?? 0);
        this.netFlow.set(data?.netFlow ?? 0);
        this.totalTransactionsCount.set(data?.totalTransactionsCount ?? 0);
        this.monthlyTransactionsCount.set(data?.monthlyTransactionsCount ?? 0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro:', err);
        this.loading.set(false);
      }
    });
  }

  /**
   * Executa quando o utilizador clica numa linha.
   * Abre o diálogo em modo edição.
   */
  onRowClick(row: DTO_Transactions) {
    this.isEdit = true;
    this.selectedCustomer = row;
    this.SelectedRowId = row.id;

    this.dialogInjector = Injector.create({
      providers: [{ provide: 'model', useValue: row }],
      parent: this.injectorFactory
    });

    this.dialogVisible = true;
  }

  /**
   * Abre o diálogo para criar um novo registo.
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
   * Abre um diálogo de confirmação e elimina as transações selecionadas.
   */
  deleteSelectedProducts() {
    this.confirmationService.confirm({
      header: 'Confirmar Eliminação',
      message: 'Tem a certeza de que pretende eliminar os itens selecionados?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.transactionsService.delete(this.selectedTransactions.map((item) => item.id)).subscribe({
          next: () => {
            this.toast.success('Eliminado com sucesso');
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
