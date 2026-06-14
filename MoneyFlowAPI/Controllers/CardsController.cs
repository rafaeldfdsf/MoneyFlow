using Microsoft.AspNetCore.Mvc;
using MoneyFlowAPI.Application.DTOs;
using MoneyFlowAPI.Services.Interfaces;

namespace MoneyFlowAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardsController : BaseController
    {
        private readonly ICardService _cardService;

        public CardsController(ICardService cardService) => _cardService = cardService;

        #region GET
        [HttpGet("cards")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_CardsPage>>> GetAll()
        {
            var response = await _cardService.GetAllCardsAsync(UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        // Devolve um cartão específico do utilizador autenticado.
        [HttpGet("card/{id}")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Card>>> GetCard(int id)
        {
            var response = await _cardService.GetCardAsync(id, UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        // Devolve apenas os dados mínimos para popular selects na UI.
        [HttpGet("select")]
        public async Task<ActionResult<IEnumerable<DTO_SelectOption>>> GetForSelect()
        {
            var cards = await _cardService.GetAllCardsAsync(UserId);

            if (!cards.Success || cards.Data == null)
                return Ok(Array.Empty<DTO_SelectOption>());

            var result = cards.Data.Cards
                .Where(card => card.IsActive)
                .Select(card => new DTO_SelectOption
                {
                    Value = card.Id,
                    Label = $"{card.Name} ({card.CardTypeLabel})"
                });

            return Ok(result);
        }
        #endregion

        #region POST
        [HttpPost("card")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Card>>> PostCard(DTO_Card card)
        {
            var response = await _cardService.CreateCardAsync(card, UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion

        #region PUT
        [HttpPut("card")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Card>>> PutCard(DTO_Card card)
        {
            var response = await _cardService.UpdateCardAsync(card, UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        // Reativa cartões sem perder histórico ou relações futuras.
        [HttpPut("cards/activate")]
        public async Task<ActionResult<DTO_ResponseTable<string>>> ActivateCards(List<int> cards)
        {
            var response = await _cardService.UpdateCardsActiveStateAsync(cards, true, UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        // Desativa cartões para impedir nova utilização mantendo os registos existentes.
        [HttpPut("cards/deactivate")]
        public async Task<ActionResult<DTO_ResponseTable<string>>> DeactivateCards(List<int> cards)
        {
            var response = await _cardService.UpdateCardsActiveStateAsync(cards, false, UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion

        #region DELETE
        [HttpPost("cards")]
        public async Task<ActionResult<DTO_ResponseTable<string>>> PostCards(List<int> cards)
        {
            var response = await _cardService.DeleteCardsAsync(cards, UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion
    }
}
