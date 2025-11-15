using TypeGen.Core.TypeAnnotations;

namespace MoneyFlowShared.DTOs
{
    [ExportTsClass]
    public class DTO_Transactions
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int? CategoryId { get; set; }

        public bool IsIncome { get; set; }

        public decimal Amount { get; set; }

        public string? Description { get; set; }

        public DateTime TransactionDate { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DTO_Category? Category { get; set; }
    }
}