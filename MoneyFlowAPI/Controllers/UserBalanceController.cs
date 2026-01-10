using Microsoft.AspNetCore.Mvc;
using MoneyFlowAPI.Services;
using MoneyFlowAPI.Services.Interfaces;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserBalanceController : BaseController
    {
        private readonly IUserBalanceService _userBalanceService;

        public UserBalanceController(IUserBalanceService userBalanceService) => _userBalanceService = userBalanceService;

        #region GET
        [HttpGet("userBalance")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_UserBalance>>> GetUserBalance()
        {
            var response = await _userBalanceService.GetUserBalance(UserId); 

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion
    }
}
