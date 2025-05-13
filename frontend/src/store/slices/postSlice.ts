import { createSlice } from '@reduxjs/toolkit'

export interface PostState {
  id: string | null
  title: string | null
  description: string | null
  images: string[] | null
  location: {
    city: string
    country: string
    location: string
  }
  night_cost: number | null
  user_id: string | null
}

export const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    isLoading: false,
    error: null
  },
  reducers: {
    pending: (state) => {
      state.isLoading = true
    },

    setPosts: (state, {payload}) => {
      state.posts = payload.posts
      state.isLoading = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { pending, setPosts } = postSlice.actions
