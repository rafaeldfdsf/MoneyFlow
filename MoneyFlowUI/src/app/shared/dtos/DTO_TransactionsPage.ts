import { DTO_Transactions } from './DTO_Transactions';

export class DTO_TransactionsPage {
    transactions: DTO_Transactions[] = [];
    currentBalance = 0;
    monthlyIncome = 0;
    monthlyExpense = 0;
    netFlow = 0;
    totalTransactionsCount = 0;
    monthlyTransactionsCount = 0;
}
