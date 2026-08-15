using Microsoft.AspNetCore.Mvc;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Services;

namespace TaskAssignAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _loginService.LoginAsync(loginDto);

            if (user == null)
                return Unauthorized("Invalid username or password.");

            return Ok(user);
        }
    }
}