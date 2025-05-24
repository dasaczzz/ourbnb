import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { startGetPost } from '../store/thunks/postThunk'
import { AppDispatch, RootState } from '../store/store'
import { fetchUserById, UserResponse } from '../lib/api'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import BookingForm from '../components/booking/BookingForm'
import { ReviewCard } from '../components/reviews/ReviewCard'
import { LoadingSpinner } from '../components/primitives/LoadingSpinner'

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
  type: string
  night_cost: number
  user_id: string
}

const PostDetail = () => {
  const {post_id} = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const post = useSelector((state: RootState) => state.post.post) as Post | null;
  const [host, setHost] = useState<UserResponse | null>(null)
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(post ? new Array(post.images.length).fill(false) : [])

  useEffect(() => {
    if (post_id) {
      dispatch(startGetPost(post_id))
    }
  }, [dispatch, post_id])

  useEffect(() => {
    const fetchHost = async () => {
      if (post && post.user_id) {
        try {
          const userInfo = await fetchUserById(post.user_id)
          setHost(userInfo)
        } catch (error) {
          console.log('No se pudo obtener la información del anfitrión')
        } 
      }
    }
    fetchHost()
  }, [post])

  if (!post) {
    return <div>Cargando...</div>
  }
  
  return (
  <div className="mx-5 min-h-screen">
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-3 rounded-lg p-5 bg-white">
      {/* Título y ubicación */}
      <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center justify-between">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <h3 className="font-bold text-gray-900">
          {post.location.city}, {post.location.country}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[480px] overflow-hidden rounded-xl">
      {/* Imagen grande (columna 1) */}
        <div className="col-span-1 md:col-span-2 h-full relative">
          {!imagesLoaded[0] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          <motion.img
            src={post.images[0]}
            alt="Imagen principal"
            className="w-full h-full object-cover"
            loading="lazy"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: imagesLoaded[0] ? 1 : 0, scale: imagesLoaded[0] ? 1 : 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onLoad={() => {
              setImagesLoaded(prev => {
                const newLoaded = [...prev]
                newLoaded[0] = true
                return newLoaded
              })
            }}
          />
        </div>

      {/* Cuatro imágenes pequeñas (2x2) */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-120">
          {post.images.slice(1, 5).map((img, i) => (
            <div key={i} className="relative">
              {!imagesLoaded[i + 1] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              )}
              <motion.img
                src={img}
                alt={`Imagen ${i + 2}`}
                className="w-full h-full object-cover"
                loading="lazy"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: imagesLoaded[i + 1] ? 1 : 0, scale: imagesLoaded[i + 1] ? 1 : 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onLoad={() => {
                    setImagesLoaded(prev => {
                      const newLoaded = [...prev]
                      newLoaded[i + 1] = true
                      return newLoaded
                    })
                  }}
              />
            </div>
          ))}
        </div>
      </div>

      

      {/* Sección de columnas */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Columna izquierda */}
        <div className="flex-1">
          <div className='justify-between flex items-center'>
          <Link to={`/HostProfile/${host?.id}`} className="flex items-center gap-1.5 mb-4 border border-gray-300 rounded-2xl p-2 shadow-md w-fit hover:bg-gradient-to-r hover:from-[#2c6d67] hover:to-blue-500 hover:text-white transition">
            <img src={host ? host.profilepic : "?"} className="rounded-full object-cover object-center size-8 aspect-square" alt="Foto del anfitrión"/>
            <p className="font-bold">Anfitrión:</p>
            <p>{host ? host.name : 'Cargando Anfitrión'}</p>
          </Link>
          <div className='flex'>
          <p className='font-bold mr-1 text-secondary-400'>Tipo: </p>
          <p className="text-md text-secondary-400 capitalize">{post.type}</p>
          </div>
          </div>

          <hr />

          <p className="font-bold text-xl mt-4 mb-1">Acerca de este lugar</p>
          <p className="text-gray-600 text-sm mb-4">{post.description}</p>

          <hr />

          <p className="font-bold text-xl mt-4 mb-4">Lo que este lugar ofrece</p>

          <hr />

        </div>

        {/* Columna derecha */}
        <div className="w-full lg:w-[360px]">

          <BookingForm />

        </div>
        
      </div>
      <ReviewCard/>
    </div>
  </div>
  );
}

export default PostDetail;
