import { toast } from 'sonner'
import { AppDispatch } from '../store'
import { pending, setPosts, setPost } from '../slices/postSlice'
import { fetchPosts } from '../../lib/api'
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