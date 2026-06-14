namespace MoneyFlowAPI.Application.DTOs
{
    public class DTO_Card
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string CardType { get; set; } = string.Empty;

        public string CardTypeLabel { get; set; } = string.Empty;

        public string? Brand { get; set; }

        public string? Last4Digits { get; set; }

        public string MaskedNumber { get; set; } = "Sem final";

        public decimal? CreditLimit { get; set; }

        public int? ClosingDay { get; set; }

        public int? DueDay { get; set; }

        public bool IsActive { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
