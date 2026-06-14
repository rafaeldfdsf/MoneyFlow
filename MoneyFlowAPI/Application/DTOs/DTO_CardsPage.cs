namespace MoneyFlowAPI.Application.DTOs
{
    public class DTO_CardsPage
    {
        public List<DTO_Card> Cards { get; set; } = new();

        public int TotalCardsCount { get; set; }

        public int ActiveCardsCount { get; set; }

        public int CreditCardsCount { get; set; }

        public int DebitCardsCount { get; set; }

        public string LatestCardName { get; set; } = "Sem dados";

        public DateTime? LatestCardCreatedAt { get; set; }
    }
}
