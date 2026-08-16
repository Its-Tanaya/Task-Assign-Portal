using AutoMapper;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Interfaces;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Services
{
    public class MessageService : IMessageService
    {
        private readonly IGenericRepository<Messages> _repository;
        private readonly IMapper _mapper;

        public MessageService(
            IGenericRepository<Messages> repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task SendMessageAsync(MessageDto messageDto)
        {
            var message = _mapper.Map<Messages>(messageDto);

            message.SentAt = DateTime.Now;
            message.IsRead = false;

            await _repository.AddAsync(message);
            await _repository.SaveAsync();
        }

        public async Task<IEnumerable<MessageDto>> GetMessagesAsync(int userId)
        {
            var messages = await _repository.GetAllAsync();

            var userMessages = messages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderBy(m => m.SentAt);

            return _mapper.Map<IEnumerable<MessageDto>>(userMessages);
        }

        public async Task MarkAsReadAsync(int messageId)
        {
            var message = await _repository.GetByIdAsync(messageId);

            if (message == null)
                return;

            message.IsRead = true;

            _repository.Update(message);
            await _repository.SaveAsync();
        }
    }
}