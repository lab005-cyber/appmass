import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeed, likePost } from '../../services/posts';

interface FeedState {
  posts: any[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  error: string | null;
}

const initialState: FeedState = {
  posts: [],
  loading: false,
  page: 1,
  hasMore: true,
  error: null,
};

export const fetchFeed = createAsyncThunk(
  'feed/fetch',
  async ({ page, limit }: { page: number; limit: number }) => {
    return getFeed(page, limit);
  }
);

export const toggleLike = createAsyncThunk(
  'feed/like',
  async ({ postId, userId }: { postId: string; userId: string }) => {
    await likePost(postId, userId);
    return postId;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => { state.loading = true; })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = [...state.posts, ...action.payload.documents];
        state.page += 1;
        state.hasMore = action.payload.documents.length > 0;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load feed';
      });
  },
});

export default feedSlice.reducer;
