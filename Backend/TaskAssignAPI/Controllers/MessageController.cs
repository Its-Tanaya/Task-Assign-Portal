using Microsoft.AspNetCore.Mvc;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Services;

namespace TaskAssignAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _service;

        public MessageController(IMessageService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(MessageDto messageDto)
        {
            await _service.SendMessageAsync(messageDto);

            return Ok(new { message = "Message sent successfully" });
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMessages(int userId)
        {
            var messages = await _service.GetMessagesAsync(userId);

            return Ok(messages);
        }

        [HttpPut("{messageId}/read")]
        public async Task<IActionResult> MarkAsRead(int messageId)
        {
            await _service.MarkAsReadAsync(messageId);

            return Ok(new { message = "Message marked as read" });
        }
    }
}