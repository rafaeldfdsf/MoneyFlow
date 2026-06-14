using AutoMapper;
using MoneyFlowAPI.Application.Cards;
using MoneyFlowAPI.Application.DTOs;
using MoneyFlowAPI.Models;
using MoneyFlowAPI.Services.Interfaces;

namespace MoneyFlowAPI.Services
{
    public class CardService : ICardService
    {
        private readonly GetAllCards _getAllCards;
        private readonly GetCard _getCard;
        private readonly CreateCard _createCard;
        private readonly UpdateCard _updateCard;
        private readonly DeleteCard _deleteCards;
        private readonly UpdateCardsActiveState _updateCardsActiveState;
        private readonly IMapper _mapper;

        public CardService(
            GetAllCards getAllCards,
            GetCard getCard,
            CreateCard createCard,
            UpdateCard updateCard,
            DeleteCard deleteCards,
            UpdateCardsActiveState updateCardsActiveState,
            IMapper mapper)
        {
            _getAllCards = getAllCards;
            _getCard = getCard;
            _createCard = createCard;
            _updateCard = updateCard;
            _deleteCards = deleteCards;
            _updateCardsActiveState = updateCardsActiveState;
            _mapper = mapper;
        }

        #region GET
        public async Task<DTO_ResponseTable<DTO_CardsPage>> GetAllCardsAsync(int userId)
        {
            try
            {
                // A página recebe já os indicadores prontos para evitar lógica de agregação na UI.
                var cards = await _getAllCards.ExecuteAsync(userId) ?? new List<Card>();
                var dtoList = _mapper.Map<List<DTO_Card>>(cards);
                var latestCard = cards
                    .OrderByDescending(card => card.CreatedAt ?? DateTime.MinValue)
                    .ThenByDescending(card => card.Id)
                    .FirstOrDefault();

                var dto = new DTO_CardsPage
                {
                    Cards = dtoList,
                    TotalCardsCount = dtoList.Count,
                    ActiveCardsCount = cards.Count(card => card.IsActive),
                    CreditCardsCount = cards.Count(card => card.CardType == "Credit"),
                    DebitCardsCount = cards.Count(card => card.CardType == "Debit"),
                    LatestCardName = latestCard?.Name ?? "Sem dados",
                    LatestCardCreatedAt = latestCard?.CreatedAt
                };

                return DTO_ResponseTable<DTO_CardsPage>.SuccessResult(dto);
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_CardsPage>.FailureResult($"Erro ao obter cartões: {ex.Message}");
            }
        }

        // Carrega o detalhe de um cartão respeitando o utilizador autenticado.
        public async Task<DTO_ResponseTable<DTO_Card>> GetCardAsync(int id, int userId)
        {
            try
            {
                var card = await _getCard.ExecuteAsync(id, userId);

                if (card == null)
                    return DTO_ResponseTable<DTO_Card>.FailureResult("Nenhum cartão encontrado.");

                var dto = _mapper.Map<DTO_Card>(card);
                return DTO_ResponseTable<DTO_Card>.SuccessResult(dto);
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_Card>.FailureResult($"Erro ao obter cartão: {ex.Message}");
            }
        }
        #endregion

        #region POST
        public async Task<DTO_ResponseTable<DTO_Card>> CreateCardAsync(DTO_Card dto, int userId)
        {
            try
            {
                if (dto == null)
                    return DTO_ResponseTable<DTO_Card>.FailureResult("Dados inválidos.");

                var entity = _mapper.Map<Card>(dto);

                if (!TryPrepareCard(entity, out var validationMessage))
                    return DTO_ResponseTable<DTO_Card>.FailureResult(validationMessage!);

                var created = await _createCard.ExecuteAsync(entity, userId);

                if (created == null)
                    return DTO_ResponseTable<DTO_Card>.FailureResult("Falha ao criar cartão.");

                var createdDto = _mapper.Map<DTO_Card>(created);
                return DTO_ResponseTable<DTO_Card>.SuccessResult(createdDto, "Cartão criado com sucesso.");
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_Card>.FailureResult($"Erro ao criar cartão: {ex.Message}");
            }
        }
        #endregion

        #region PUT
        public async Task<DTO_ResponseTable<DTO_Card>> UpdateCardAsync(DTO_Card dto, int userId)
        {
            try
            {
                if (dto == null)
                    return DTO_ResponseTable<DTO_Card>.FailureResult("Dados inválidos.");

                var entity = _mapper.Map<Card>(dto);

                if (!TryPrepareCard(entity, out var validationMessage))
                    return DTO_ResponseTable<DTO_Card>.FailureResult(validationMessage!);

                var updated = await _updateCard.ExecuteAsync(entity, userId);

                if (updated == null)
                    return DTO_ResponseTable<DTO_Card>.FailureResult("Cartão não encontrado.");

                var updatedDto = _mapper.Map<DTO_Card>(updated);
                return DTO_ResponseTable<DTO_Card>.SuccessResult(updatedDto, "Cartão atualizado com sucesso.");
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_Card>.FailureResult($"Erro ao atualizar cartão: {ex.Message}");
            }
        }

        // Atualiza o estado ativo/inativo em lote sem alterar os restantes campos do cartão.
        public async Task<DTO_ResponseTable<string>> UpdateCardsActiveStateAsync(List<int> cardsIds, bool isActive, int userId)
        {
            try
            {
                if (cardsIds == null || !cardsIds.Any())
                    return DTO_ResponseTable<string>.FailureResult("Nenhum cartão selecionado.");

                var updated = await _updateCardsActiveState.ExecuteAsync(cardsIds, userId, isActive);

                if (!updated)
                    return DTO_ResponseTable<string>.FailureResult("Falha ao atualizar o estado dos cartões.");

                var message = isActive
                    ? "Cartões ativados com sucesso."
                    : "Cartões desativados com sucesso.";

                return DTO_ResponseTable<string>.SuccessResult(message);
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<string>.FailureResult($"Erro ao atualizar o estado dos cartões: {ex.Message}");
            }
        }
        #endregion

        #region DELETE
        public async Task<DTO_ResponseTable<string>> DeleteCardsAsync(List<int> cardsIds, int userId)
        {
            try
            {
                if (cardsIds == null || !cardsIds.Any())
                    return DTO_ResponseTable<string>.FailureResult("Nenhum cartão selecionado.");

                var deleted = await _deleteCards.ExecuteAsync(cardsIds, userId);

                if (!deleted)
                    return DTO_ResponseTable<string>.FailureResult("Falha ao eliminar cartões.");

                return DTO_ResponseTable<string>.SuccessResult("Cartões removidos com sucesso.");
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<string>.FailureResult($"Erro ao eliminar cartões: {ex.Message}");
            }
        }
        #endregion

        // Centraliza a normalização e as validações mínimas comuns a débito e crédito.
        private static bool TryPrepareCard(Card card, out string? validationMessage)
        {
            validationMessage = null;

            if (string.IsNullOrWhiteSpace(card.Name))
            {
                validationMessage = "O nome do cartão é obrigatório.";
                return false;
            }

            card.Name = card.Name.Trim();
            card.Brand = string.IsNullOrWhiteSpace(card.Brand) ? null : card.Brand.Trim();
            card.Last4Digits = string.IsNullOrWhiteSpace(card.Last4Digits) ? null : card.Last4Digits.Trim();

            var normalizedType = NormalizeCardType(card.CardType);
            if (normalizedType == null)
            {
                validationMessage = "O tipo de cartão é inválido.";
                return false;
            }

            card.CardType = normalizedType;

            if (card.Last4Digits != null && (card.Last4Digits.Length != 4 || !card.Last4Digits.All(char.IsDigit)))
            {
                validationMessage = "Os últimos 4 dígitos devem conter exatamente 4 números.";
                return false;
            }

            if (card.CreditLimit.HasValue && card.CreditLimit.Value < 0)
            {
                validationMessage = "O limite de crédito não pode ser negativo.";
                return false;
            }

            if (card.CardType == "Credit")
            {
                if (!IsValidDay(card.ClosingDay) || !IsValidDay(card.DueDay))
                {
                    validationMessage = "Os dias de fecho e pagamento devem estar entre 1 e 31.";
                    return false;
                }
            }
            else
            {
                card.CreditLimit = null;
                card.ClosingDay = null;
                card.DueDay = null;
            }

            return true;
        }

        // Normaliza o valor recebido da UI para o formato persistido na base de dados.
        private static string? NormalizeCardType(string? cardType)
        {
            return cardType?.Trim().ToLowerInvariant() switch
            {
                "debit" => "Debit",
                "credit" => "Credit",
                _ => null
            };
        }

        // Garante que os dias de fecho e pagamento ficam dentro do intervalo do calendário.
        private static bool IsValidDay(int? day) => day.HasValue && day.Value >= 1 && day.Value <= 31;
    }
}
