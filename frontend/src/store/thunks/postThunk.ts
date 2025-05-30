import { AppDispatch } from '../store'
import { fetchPosts, fetchPost, fetchPostsBySearch, fetchPostsByUser, fetchDeletePost } from '../../lib/api'
import { setPosts, setPost, setUserPosts } from '../slices/postSlice'
import { toast } from 'sonner'

export const startGetPosts = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const data = await fetchPosts()
      // Asegurarnos de que data es un array
      if (Array.isArray(data)) {
        dispatch(setPosts({ posts: data }))
      } else if (data && typeof data === 'object' && Array.isArray(data.posts)) {
        // Si los posts están dentro de un objeto
        dispatch(setPosts({ posts: data.posts }))
      } else {
        console.error('Los datos recibidos no son un array:', data)
        dispatch(setPosts({ posts: [] }))
        toast.error('Error al cargar los posts')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      dispatch(setPosts({ posts: [] }))
    }
  }
}

export const startGetPost = (post_id: string) => {
  return async(dispatch: AppDispatch) => {
    try {
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
      const data = await fetchPostsByUser(user_id)
      if (Array.isArray(data)) {
        dispatch(setUserPosts({posts: data}))
      } else if (data && typeof data === 'object' && Array.isArray(data.posts)) {
        dispatch(setUserPosts({posts: data.posts}))
      } else {
        console.error('Los datos recibidos no son un array:', data)
        dispatch(setUserPosts({posts: []}))
        toast.error('Error al cargar los posts del usuario')
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
      const data = await fetchPostsBySearch(query)
      if (Array.isArray(data)) {
        dispatch(setPosts({posts: data}))
      } else if (data && typeof data === 'object' && Array.isArray(data.posts)) {
        dispatch(setPosts({posts: data.posts}))
      } else {
        console.error('Los datos recibidos no son un array:', data)
        dispatch(setPosts({posts: []}))
        toast.error('Error al buscar posts')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        dispatch(setPosts({posts: []}))
      }
    }
  }
}
