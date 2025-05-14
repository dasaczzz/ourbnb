import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { startGetPost } from '../store/thunks/postThunk'
import { AppDispatch, RootState } from '../store/store'

interface PostLocation {
  city: string
  country: string
  location: string
}

interface Post {
  id: string
  title: string
  description: string
  images: string[]
  location: PostLocation
  night_cost: number
}

const PostDetail = () => {
  const {post_id} = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const post = useSelector((state: RootState) => state.post.post) as Post | null;

  useEffect(() => {
    if (post_id) {
      dispatch(startGetPost(post_id))
    }
  }, [dispatch, post_id])

  if (!post) {
    return <div>Cargando...</div>
  }

  const priceToPrint = post.night_cost.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'COP',
  })

    return (
      <div className="p-5 flex justify-center">
          <div className="flex gap-5 w-full rounded-lg p-5 bg-white ml-15">
              {post.images && post.images.length > 0 && (
                <img className="w-150 rounded-lg" src={post.images[0]} alt={post.title || 'Imagen del producto'} />
              )}
              <div className="flex-col justify-between">
                  <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                  <h3 className="text-gray-900 mb-2">{post.location.city}, {post.location.country}</h3>
                  <p className="text-gray-600 mb-2">{post.description}</p>
                  <div className="flex">
                    <p className="text-xl font-bold">{priceToPrint}</p>
                    <p className="text-xl text-gray-600 ml-1.5" > noche</p>
                  </div>
              </div>
          </div>
          
      </div>
  );
}

export default PostDetail;
