namespace MoneyFlowAPI.Application.DTOs
{
    public class DTO_TransactionsPage
    {
        public List<DTO_Transactions> Transactions { get; set; } = new();

        public decimal CurrentBalance { get; set; }

        public decimal MonthlyIncome { get; set; }

        public decimal MonthlyExpense { get; set; }

        public decimal NetFlow { get; set; }

        public int TotalTransactionsCount { get; set; }

        public int MonthlyTransactionsCount { get; set; }
    }
}
