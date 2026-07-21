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
    const result = await getFeed(page, limit);
    return { ...result, page };
  }
);

export const toggleLike = createAsyncThunk(
  'feed/like',
  async ({ postId, userId }: { postId: string; userId: string }) => {
    await likePost(postId, userId);
    return { postId, userId };
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
        const { documents, page } = action.payload;
        if (page === 1) {
          state.posts = documents;
        } else {
          state.posts = [...state.posts, ...documents];
        }
        state.page = page + 1;
        state.hasMore = documents.length > 0;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load feed';
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((p: any) => p.$id === postId);
        if (post) {
          post.isLiked = !post.isLiked;
          post.likeCount = (post.likeCount || 0) + (post.isLiked ? 1 : -1);
        }
      });
  },
});

export default feedSlice.reducer;
