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
      // Separate images from the post data for initial creation
      const imagesToUpload = post.images;
      
      // Create a new object without the images property for post creation
      const postDataWithoutImages: Partial<PostState> = {};
      for (const key in post) {
        if (key !== 'images') {
          (postDataWithoutImages as any)[key] = (post as any)[key];
        }
      }

      // Create the post without images
      const createdPost = await fetchCreatePost(postDataWithoutImages);

      // Upload images one by one after the post is created
      if (imagesToUpload && createdPost && createdPost.id) {
        for (const item of imagesToUpload) {
          if (item instanceof File) { // Ensure the item is a File object before appending
            const formData = new FormData();
            formData.append('file', item);
            try {
              await fetchSetPostImages(createdPost.id, formData);
              toast.success(`Imagen ${item.name} subida con éxito.`);
            } catch (uploadError) {
              console.error("Error uploading image:", uploadError);
              toast.error(`Error al subir la imagen ${item.name}.`);
            }
          } else {
               console.error("Expected File object for upload, but received:", item);
               toast.error(`Error interno: tipo de imagen inesperado.`);
          }
        }
      }

      toast.success('Publicacion creada exitosamente!')
      dispatch(updateDraftPost({})) // Clear the draft post after successful creation and upload
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Confirma otra vez, por favor.`)
      } else {
        toast.error('Ocurrió un error desconocido al crear el post.')
      }
    }
  }
}
