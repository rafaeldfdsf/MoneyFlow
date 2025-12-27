using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MoneyFlowAPI.Controllers
{
    [Authorize]
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected int UserId
        {
            get
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    throw new UnauthorizedAccessException("UserId não encontrado no token.");

                return int.Parse(userId);
            }
        }

        protected string UserName
            => User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;

        protected string UserEmail
            => User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    }
}
