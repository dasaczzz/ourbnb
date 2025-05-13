import { toast } from 'sonner'
import { AppDispatch } from '../store'
import { pending, setPosts } from '../slices/postSlice'
import { fetchPosts } from '../../lib/api'

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
