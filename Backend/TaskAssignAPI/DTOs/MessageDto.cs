namespace TaskAssignAPI.DTOs
{
    public class MessageDto
    {
        public int MessageId { get; set; }

        public int SenderId { get; set; }

        public int ReceiverId { get; set; }

        public int? TaskId { get; set; }

        public string MessageText { get; set; } = string.Empty;

        public DateTime SentAt { get; set; }

        public bool IsRead { get; set; }
    }
}