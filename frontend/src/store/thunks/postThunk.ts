import { AppDispatch } from '../store'
import { fetchPosts, fetchPost, fetchPostsBySearch, fetchPostsByUser, fetchCreatePost, fetchSetPostImages } from '../../lib/api'
import { setPosts, setPost, setUserPosts, pending, updateDraftPost, PostState } from '../slices/postSlice'
import { toast } from 'sonner'

export const startGetPosts = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const data = await fetchPosts()
      dispatch(setPosts({ posts: data }))
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
      dispatch(setPost({post: data}))
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

export const startCreatePost = (post: Partial<PostState>) => {
  return async(dispatch: AppDispatch) => {
    dispatch(pending())
    try {
      const data = await fetchCreatePost(post)
      post.images?.forEach(async item => {
        const formData = new FormData()
        formData.append('file', item)
        console.log(formData)
        await fetchSetPostImages(data.id, formData)
      })
      toast.success('Publicacion subida exitosamente!')
      dispatch(updateDraftPost({}))
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al crear el post: ${error.message}`)
      } else {
        toast.error('Ocurrió un error desconocido al crear el post.')
      }
    }
  }
}
