namespace MoneyFlowAPI.Application.DTOs
{
    public class DTO_DashboardTopCategory
    {
        public string Name { get; set; } = string.Empty;

        public decimal Total { get; set; }

        public decimal Percentage { get; set; }

        public int TransactionsCount { get; set; }
    }
}
