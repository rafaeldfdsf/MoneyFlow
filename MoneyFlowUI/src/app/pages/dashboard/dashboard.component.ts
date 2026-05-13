import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { DashboardService } from '@/services/Dashboard.service';
import { DTO_Dashboard } from '@/shared/dtos/DTO_Dashboard';

interface DashboardMetric {
    label: string;
    value: number;
    icon: string;
    tone: string;
    help: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DecimalPipe, DatePipe],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    // Estado base da dashboard.
    loading = signal(true);
    errorMessage = signal('');
    dashboardData = signal<DTO_Dashboard | null>(null);

    // Dados resolvidos da dashboard com fallback seguro para o template.
    dashboard = computed(() => this.dashboardData() ?? new DTO_Dashboard());

    // Cartões principais da dashboard.
    metrics = computed<DashboardMetric[]>(() => [
        {
            label: 'Saldo Atual',
            value: this.dashboard().currentBalance,
            icon: 'pi-wallet',
            tone: 'bg-blue-100 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300',
            help: 'Saldo acumulado com base em todos os movimentos.'
        },
        {
            label: 'Receitas do Mês',
            value: this.dashboard().monthlyIncome,
            icon: 'pi-arrow-down-left',
            tone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300',
            help: 'Total das entradas registadas no mês atual.'
        },
        {
            label: 'Despesas do Mês',
            value: this.dashboard().monthlyExpense,
            icon: 'pi-arrow-up-right',
            tone: 'bg-orange-100 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300',
            help: 'Total das saídas registadas no mês atual.'
        },
        {
            label: 'Poupança Líquida',
            value: this.dashboard().netSavings,
            icon: 'pi-chart-line',
            tone: this.dashboard().netSavings >= 0
                ? 'bg-teal-100 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300'
                : 'bg-red-100 text-red-600 dark:bg-red-400/10 dark:text-red-300',
            help: 'Receitas menos despesas dentro do período.'
        }
    ]);

    constructor(private dashboardService: DashboardService) { }

    /**
     * Carrega os dados reais necessários para a dashboard.
     */
    ngOnInit(): void {
        this.loadDashboardData();
    }

    /**
     * Vai buscar os dados agregados da dashboard à API.
     */
    private loadDashboardData(): void {
        this.loading.set(true);
        this.errorMessage.set('');

        this.dashboardService.get().subscribe({
            next: (data) => {
                this.dashboardData.set(data ?? new DTO_Dashboard());
                this.loading.set(false);
            },
            error: () => {
                this.errorMessage.set('Não foi possível carregar a dashboard financeira.');
                this.loading.set(false);
            }
        });
    }
}
