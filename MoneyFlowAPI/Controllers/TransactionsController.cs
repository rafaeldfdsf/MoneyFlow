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

        public TransactionsController(ITransactionService transactionService) => _transactionService = transactionService;

        #region GET
        [HttpGet("transactions")]
        public async Task<ActionResult<DTO_ResponseTable<List<DTO_Transactions>>>> GetAll()
        {
            var response = await _transactionService.GetAllTransactionsAsync();

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpGet("transaction/{id}")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Transactions>>> GetTransaction(int id)
        {
            var response = await _transactionService.GetTransactionAsync(id);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion

        #region POST
        [HttpPost("transaction")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Transactions>>> PostTransaction(DTO_Transactions transaction)
        {
            var response = await _transactionService.CreateTransactionAsync(transaction);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion

        #region DELETE
        [HttpDelete("transactions")]
        public async Task<ActionResult<DTO_ResponseTable<string>>> PostTransaction(List<int> transactions)
        {
            var response = await _transactionService.DeleteTransactionsAsync(transactions);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion
    }
}
