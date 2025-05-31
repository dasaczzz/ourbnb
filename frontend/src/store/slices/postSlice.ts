import { createSlice } from '@reduxjs/toolkit'

export interface PostState {
  id: string | null
  title: string | null
  description: string | null
  images: (string | File)[] | null
  location: {
    city: string
    country: string
    location: string
  }
  type: string
  night_cost: number | null
  user_id: string | null
  facilites: string[]
}

interface PostSliceState {
  posts: PostState[]
  post: PostState | null
  userPosts: PostState[]
  draftPost: Partial<PostState>
  isLoading: boolean
  error: string | null
}

const initialState: PostSliceState = {
  posts: [],
  post: null,
  userPosts: [],
  draftPost: {},
  isLoading: false,
  error: null,
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    pending: (state) => {
      state.isLoading = true
    },

    setPosts: (state, {payload}) => {
      state.posts = payload.posts
      state.isLoading = false
    },

    setPost: (state, {payload}) => {
      state.post = payload.post
      state.isLoading = false
    },
    setUserPosts: (state, {payload}) => {
      state.userPosts = payload.posts
      state.isLoading = false
    },
    updateDraftPost: (state, { payload }) => {
      state.draftPost = {
        ...state.draftPost,
        ...payload,
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { pending, setPosts, setPost, setUserPosts, updateDraftPost } = postSlice.actions
