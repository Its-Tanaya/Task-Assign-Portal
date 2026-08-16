using TaskAssignAPI.DTOs;

namespace TaskAssignAPI.Services
{
    public interface IMessageService
    {
        Task SendMessageAsync(MessageDto messageDto);

        Task<IEnumerable<MessageDto>> GetMessagesAsync(
            int userId);

        Task MarkAsReadAsync(int messageId);
    }
}