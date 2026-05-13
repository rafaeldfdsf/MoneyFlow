namespace MoneyFlowAPI.Application.DTOs
{
    public class DashboardSummary
    {
        public string MonthLabel { get; set; } = string.Empty;

        public decimal CurrentBalance { get; set; }

        public decimal MonthlyIncome { get; set; }

        public decimal MonthlyExpense { get; set; }

        public decimal NetSavings { get; set; }

        public int MonthlyTransactionsCount { get; set; }

        public decimal SavingsRate { get; set; }

        public string LatestTransactionDescription { get; set; } = "Sem movimentos";

        public DateOnly? LatestTransactionDate { get; set; }

        public List<DashboardTopCategorySummary> TopCategories { get; set; } = new();
    }
}
