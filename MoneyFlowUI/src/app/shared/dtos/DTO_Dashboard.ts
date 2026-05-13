import { DTO_DashboardTopCategory } from './DTO_DashboardTopCategory';

export class DTO_Dashboard {
    monthLabel = '';
    currentBalance = 0;
    monthlyIncome = 0;
    monthlyExpense = 0;
    netSavings = 0;
    monthlyTransactionsCount = 0;
    savingsRate = 0;
    latestTransactionDescription = 'Sem movimentos';
    latestTransactionDate: string | null = null;
    topCategories: DTO_DashboardTopCategory[] = [];
}
