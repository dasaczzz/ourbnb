import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { ChatMessage } from './ChatMessage';
import { database, ref, push, set } from '../../lib/firebase';
import { addMessage } from '../../store/slices/chatSlice';
import { FaPaperPlane } from 'react-icons/fa';

interface ChatWindowProps {
  conversationId: string;
  participantPhoto: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, participantPhoto }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const messages = useSelector((state: RootState) => 
    state.chat.messages[conversationId] ?? []
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser.id) return;

    const timestamp = Date.now();
    const messageData = {
      senderId: currentUser.id,
      text: newMessage.trim(),
      timestamp
    };

    // Send to Firebase
    const chatRef = ref(database, `chats/${conversationId}/messages`);
    const newMessageRef = push(chatRef);
    await set(newMessageRef, messageData);

    // Firebase will trigger the real-time update, no need to dispatch locally

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-3">
        {Array.from(new Map(messages.map(m => [m.id, m])).values()).map((message) => (
          <ChatMessage
            key={message.id}
            text={message.text}
            timestamp={message.timestamp}
            isSender={message.senderId === currentUser.id}
            senderPhoto={message.senderId === currentUser.id ? currentUser.profilepic! : participantPhoto}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-2 bg-white border-t border-gray-200">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 text-sm rounded-full border border-gray-300 px-3 py-1.5 focus:outline-none focus:border-primary-400"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary-400 text-white rounded-full p-1.5 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
