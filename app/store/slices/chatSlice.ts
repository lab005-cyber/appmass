import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  sendMessage,
  createConversation,
  getUserConversations,
  searchProfiles,
  getConversationMessages,
} from '../../services/messaging';

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
  async ({ participantId, participantName }: { participantId: string; participantName: string }, { getState }: any) => {
    const currentUserId = (getState() as any).auth?.user?.$id;
    const currentUserName = (getState() as any).auth?.user?.name || 'Unknown';
    if (!currentUserId) throw new Error('Not authenticated');
    const conv = await createConversation(currentUserId, participantId, currentUserName, participantName);
    return { ...conv, participantId, participantName };
  }
);

export const sendChatMessage = createAsyncThunk(
  'chat/send',
  async ({ conversationId, content }: { conversationId: string; content: string }, { getState }: any) => {
    const senderId = (getState() as any).auth?.user?.$id;
    return sendMessage(conversationId, content, senderId);
  }
);

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { getState }: any) => {
    const userId = (getState() as any).auth?.user?.$id;
    if (!userId) return [];
    const conversations = await getUserConversations(userId);
    return conversations.map((conv: any) => ({
      ...conv,
      participantId: conv.creatorId === userId ? conv.participantId : conv.creatorId,
      participantName: conv.creatorId === userId ? conv.participantName : conv.creatorName,
    }));
  }
);

export const searchUsers = createAsyncThunk(
  'chat/searchUsers',
  async (query: string) => {
    return searchProfiles(query);
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: string) => {
    const result = await getConversationMessages(conversationId);
    return { conversationId, documents: result.documents };
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
      const exists = state.messages[conversationId].some((m: any) => m.$id === message.$id);
      if (!exists) {
        state.messages[conversationId].push(message);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startConversation.fulfilled, (state, action) => {
        const conv = action.payload;
        const exists = state.conversations.some((c: any) => c.$id === conv.$id);
        if (!exists) {
          const otherId = conv.participantId;
          const otherName = conv.participantName;
          state.conversations.unshift({
            ...conv,
            participantId: otherId,
            participantName: otherName,
          });
        }
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        const msg = action.payload;
        if (!state.messages[msg.conversationId]) {
          state.messages[msg.conversationId] = [];
        }
        const exists = state.messages[msg.conversationId].some((m: any) => m.$id === msg.$id);
        if (!exists) {
          state.messages[msg.conversationId].push(msg);
        }
      })
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load conversations';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, documents } = action.payload;
        state.messages[conversationId] = documents;
      })
      .addCase(searchUsers.fulfilled, (state) => {
        // search results handled in component state
      });
  },
});

export const { setActiveConversation, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
