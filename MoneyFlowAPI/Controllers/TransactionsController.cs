using Microsoft.AspNetCore.Mvc;
using MoneyFlowAPI.Application.DTOs;
using MoneyFlowAPI.Services.Interfaces;

namespace MoneyFlowAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : BaseController
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService) => _transactionService = transactionService;

        #region GET
        [HttpGet("transactions")]
        public async Task<ActionResult<DTO_ResponseTable<List<DTO_Transactions>>>> GetAll()
        {
            var response = await _transactionService.GetAllTransactionsAsync(UserId);

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

        #region PUT
        [HttpPut("transaction")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Transactions>>> PutTransaction(DTO_Transactions transaction)
        {
            var response = await _transactionService.UpdateTransactionAsync(transaction, UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion

        #region POST
        [HttpPost("transaction")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Transactions>>> PostTransaction(DTO_Transactions transaction)
        {
            var response = await _transactionService.CreateTransactionAsync(transaction, UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion

        #region DELETE
        [HttpPost("transactions")]
        public async Task<ActionResult<DTO_ResponseTable<string>>> PostTransaction(List<int> transactions)
        {
            var response = await _transactionService.DeleteTransactionsAsync(transactions, UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion
    }
}
