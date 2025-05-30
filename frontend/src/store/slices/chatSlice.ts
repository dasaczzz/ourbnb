import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantPhoto: string;
  lastMessage?: string;
  unreadCount: number;
}

interface ChatState {
  isModalOpen: boolean;
  conversations: Conversation[];
  activeConversation: string | null;
  messages: { [conversationId: string]: Message[] };
}

const initialState: ChatState = {
  isModalOpen: false,
  conversations: [],
  activeConversation: null,
  messages: {},
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChatModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    openChat: (state, action: PayloadAction<{ conversationId: string }>) => {
      state.isModalOpen = true;
      state.activeConversation = action.payload.conversationId;
    },
    closeChat: (state) => {
      state.isModalOpen = false;
      state.activeConversation = null;
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      if (!state.conversations.find(conv => conv.id === action.payload.id)) {
        state.conversations.push(action.payload);
      }
    },
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      if (!state.messages[action.payload.conversationId]) {
        state.messages[action.payload.conversationId] = [];
      }
      state.messages[action.payload.conversationId].push(action.payload.message);
      
      // Update conversation's last message
      const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conversation) {
        conversation.lastMessage = action.payload.message.text;
        if (state.activeConversation !== action.payload.conversationId) {
          conversation.unreadCount++;
        }
      }
    },
    clearUnreadCount: (state, action: PayloadAction<{ conversationId: string }>) => {
      const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    }
  },
});

export const {
  toggleChatModal,
  openChat,
  closeChat,
  setConversations,
  addConversation,
  setMessages,
  addMessage,
  clearUnreadCount
} = chatSlice.actions;

export default chatSlice.reducer;
