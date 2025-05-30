import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { openChat, clearUnreadCount } from '../../store/slices/chatSlice';

export const ChatList = () => {
  const dispatch = useDispatch();
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const activeConversation = useSelector((state: RootState) => state.chat.activeConversation);

  const handleSelectConversation = (conversationId: string) => {
    dispatch(openChat({ conversationId }));
    dispatch(clearUnreadCount({ conversationId }));
  };

  return (
    <div className="border-r border-gray-200 w-full overflow-y-auto">
      <div className="divide-y divide-gray-200">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => handleSelectConversation(conversation.id)}
            className={`w-full p-3 flex items-center gap-2 hover:bg-gray-50 transition-colors ${
              activeConversation === conversation.id ? 'bg-gray-100' : ''
            }`}
          >
            <div className="relative">
              <img
                src={conversation.participantPhoto}
                alt={conversation.participantName}
                className="w-10 h-10 rounded-full object-cover"
              />
              {conversation.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-sm">{conversation.participantName}</h3>
              {conversation.lastMessage && (
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage}
                </p>
              )}
            </div>
          </button>
        ))}
        {conversations.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No tienes conversaciones aún
          </div>
        )}
      </div>
    </div>
  );
};
