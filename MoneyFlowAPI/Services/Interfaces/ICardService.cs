using MoneyFlowAPI.Application.DTOs;

namespace MoneyFlowAPI.Services.Interfaces
{
    public interface ICardService
    {
        Task<DTO_ResponseTable<DTO_CardsPage>> GetAllCardsAsync(int userId);
        Task<DTO_ResponseTable<DTO_Card>> GetCardAsync(int id, int userId);
        Task<DTO_ResponseTable<DTO_Card>> CreateCardAsync(DTO_Card card, int userId);
        Task<DTO_ResponseTable<DTO_Card>> UpdateCardAsync(DTO_Card card, int userId);
        Task<DTO_ResponseTable<string>> DeleteCardsAsync(List<int> cardsIds, int userId);
        Task<DTO_ResponseTable<string>> UpdateCardsActiveStateAsync(List<int> cardsIds, bool isActive, int userId);
    }
}
