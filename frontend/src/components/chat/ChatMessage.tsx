interface ChatMessageProps {
  text: string;
  timestamp: number;
  isSender: boolean;
  senderPhoto?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ text, timestamp, isSender, senderPhoto }) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2 group`}>
      <div className="flex items-end gap-1">
        {!isSender && senderPhoto && (
          <img 
            src={senderPhoto} 
            alt="sender" 
            className="w-6 h-6 rounded-full mb-1"
          />
        )}
        <div
          className={`max-w-[85%] rounded-2xl px-3 py-1.5 ${
            isSender 
              ? 'bg-primary-400 text-white rounded-br-sm' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
          }`}
        >
          <p className="text-sm break-words">{text}</p>
          <span className="text-[10px] opacity-75 mt-0.5 block">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
