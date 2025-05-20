import { toast } from 'sonner'
import { AppDispatch } from '../store'
import { pending, setPosts, setPost, setUserPosts } from '../slices/postSlice'
import { fetchPosts, fetchPostsByUser, fetchPostsBySearch } from '../../lib/api'
import { fetchPost } from '../../lib/api'

export const startGetPosts = () => {
  return async(dispatch: AppDispatch) => {
    try {
      dispatch(pending())
      const data = await fetchPosts()
      dispatch(setPosts({posts: data}))
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
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
      if (error instanceof Error) toast.error(error.message)
    }
  }
}

export const startGetPostsByUser = (user_id: string) => {
  return async(dispatch: AppDispatch) => {
    try {
      dispatch(pending())
      const data = await fetchPostsByUser(user_id)
      dispatch(setUserPosts({posts: data}))
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }
}

export const startSearchPosts = (query: string) => {
  return async(dispatch: AppDispatch) => {
    try {
      dispatch(pending())
      const data = await fetchPostsBySearch(query)
      dispatch(setPosts({posts: data}))
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }
}
