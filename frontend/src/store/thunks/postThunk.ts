import { toast } from 'sonner'
import { AppDispatch } from '../store'
import { pending, setPosts, setPost, setUserPosts } from '../slices/postSlice'
import { fetchPosts, fetchPostsByUser, fetchPostsBySearch } from '../../lib/api'
import { fetchPost } from '../../lib/api'

export const startGetPosts = (filters?: { city?: string; country?: string; minPrice?: number; maxPrice?: number }) => {
  return async(dispatch: AppDispatch) => {
    try {
      dispatch(pending())
      const data = await fetchPosts(filters)
      if (Array.isArray(data)) {
        dispatch(setPosts({posts: data}))
      } else {
        dispatch(setPosts({posts: []}))
        console.error('Los datos recibidos no son un array:', data)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        dispatch(setPosts({posts: []}))
      }
    }
  }
}

export const startGetPost = (post_id: string) => {
  return async(dispatch: AppDispatch) => {
    try {
      dispatch(pending())
      const data = await fetchPost(post_id)
      if (data) {
        dispatch(setPost({post: data}))
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        dispatch(setPost({post: null}))
      }
    }
  }
}

export const startGetPostsByUser = (user_id: string) => {
  return async(dispatch: AppDispatch) => {
    try {
      dispatch(pending())
      const data = await fetchPostsByUser(user_id)
      if (Array.isArray(data)) {
        dispatch(setUserPosts({posts: data}))
      } else {
        dispatch(setUserPosts({posts: []}))
        console.error('Los datos recibidos no son un array:', data)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        dispatch(setUserPosts({posts: []}))
      }
    }
  }
}

export const startSearchPosts = (query: string) => {
  return async(dispatch: AppDispatch) => {
    try {
      dispatch(pending())
      const data = await fetchPostsBySearch(query)
      if (Array.isArray(data)) {
        dispatch(setPosts({posts: data}))
      } else {
        dispatch(setPosts({posts: []}))
        console.error('Los datos recibidos no son un array:', data)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        dispatch(setPosts({posts: []}))
      }
    }
  }
}
