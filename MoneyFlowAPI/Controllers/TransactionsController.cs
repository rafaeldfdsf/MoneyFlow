using Microsoft.AspNetCore.Mvc;
using MoneyFlowAPI.Services.Interfaces;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet]
        public async Task<ActionResult<DTO_ResponseTable<List<DTO_Transactions>>>> GetAll()
        {
            var response = await _transactionService.GetAllTransactionsAsync();

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}
