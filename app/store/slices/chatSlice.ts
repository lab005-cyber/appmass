import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendMessage, createConversation } from '../../services/messaging';

interface ChatState {
  conversations: any[];
  activeConversation: string | null;
  messages: Record<string, any[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: {},
  loading: false,
  error: null,
};

export const startConversation = createAsyncThunk(
  'chat/create',
  async (participants: string[]) => {
    return createConversation(participants);
  }
);

export const sendChatMessage = createAsyncThunk(
  'chat/send',
  async ({ conversationId, content }: { conversationId: string; content: string }, { getState }: any) => {
    const senderId = (getState() as any).auth?.user?.$id;
    return sendMessage(conversationId, content, senderId);
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        const msg = action.payload;
        if (!state.messages[msg.conversationId]) {
          state.messages[msg.conversationId] = [];
        }
        state.messages[msg.conversationId].push(msg);
      });
  },
});

export const { setActiveConversation, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
