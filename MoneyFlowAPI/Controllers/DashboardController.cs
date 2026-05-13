using Microsoft.AspNetCore.Mvc;
using MoneyFlowAPI.Application.DTOs;
using MoneyFlowAPI.Services.Interfaces;

namespace MoneyFlowAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : BaseController
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Dashboard>>> GetDashboard()
        {
            var response = await _dashboardService.GetDashboardAsync(UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}
