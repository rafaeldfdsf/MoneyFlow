using Microsoft.AspNetCore.Mvc;
using MoneyFlowAPI.Services;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService) => _authService = authService;

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] DTO_Register dto)
        {
            var error = await _authService.Register(dto);
            if (error != null)
                return BadRequest(error);

            return Ok("Utilizador registado com sucesso.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] DTO_Login dto)
        {
            var result = await _authService.Login(dto);
            if (result == null)
                return Unauthorized("Credenciais inválidas.");

            return Ok(result);
        }
    }
}