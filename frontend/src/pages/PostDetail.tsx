import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { startGetPost } from '../store/thunks/postThunk'
import { AppDispatch, RootState } from '../store/store'
import { fetchUserById, UserResponse } from '../lib/api'

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
  user_id: string
}

const PostDetail = () => {
  const {post_id} = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const post = useSelector((state: RootState) => state.post.post) as Post | null;
  const [host, setHost] = useState<UserResponse | null>(null)

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

  const priceToPrint = post.night_cost.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'COP',
  })

  return (
  <div className="p-5 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-5 rounded-lg p-5 bg-white">
      {/* Título y ubicación */}
      <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <h3 className="font-bold text-gray-900">
          {post.location.city}, {post.location.country}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[500px] overflow-hidden rounded-xl">
      {/* Imagen grande (columna 1) */}
        <div className="col-span-1 md:col-span-2 h-full">
          <img
            src={post.images[0]}
            alt="Imagen principal"
            className="w-full h-full object-cover"
          />
        </div>

      {/* Cuatro imágenes pequeñas (2x2) */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
          {post.images.slice(1, 5).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Imagen ${i + 2}`}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      </div>

      

      {/* Sección de columnas */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Columna izquierda */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-4">
            <img src={host ? host.profilepic : "?"} className="rounded-full object-cover object-center size-8 aspect-square" alt="Foto del anfitrión"/>
            <p className="font-bold">Anfitrión:</p>
            <p>{host ? host.name : 'Nombre no disponible'}</p>
          </div>

          <hr />

          <p className="font-bold text-xl mt-4 mb-1">Acerca de este lugar</p>
          <p className="text-gray-600 text-sm mb-4">{post.description}</p>

          <hr />

          <p className="font-bold text-xl mt-4 mb-1">Lo que este lugar ofrece</p>
        </div>

        {/* Columna derecha */}
        <div className="w-full lg:w-[360px]">
          <div className="mt-3 p-5 shadow-lg border border-gray-300 rounded-2xl flex flex-col gap-3">
            <div>
              <p className="text-xs text-gray-500 mt-2">Precio total sin impuestos</p>
              <p className="text-2xl font-bold">{priceToPrint}</p>
            </div>

            {/* Selector de fechas */}
            <div className="shadow-xl grid grid-cols-2 gap-2 border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex flex-col border-r border-gray-300 px-3 py-2">
                <label className="text-xs font-semibold text-gray-500 mb-1">Llegada</label>
                <input type="date" className="text-xs text-gray-700" />
              </div>
              <div className="flex flex-col px-3 py-2">
                <label className="text-xs font-semibold text-gray-500 mb-1">Salida</label>
                <input type="date" className="text-xs text-gray-700" />
              </div>
            </div>

            {/* Selector de huéspedes */}
            <div className="shadow-xl border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex flex-col px-3 py-2">
                <label className="text-xs font-semibold text-gray-500 mb-1">Huéspedes</label>
                <input type="text" className="text-xs text-gray-700" placeholder="1 huésped" />
              </div>
            </div>

            <button className="shadow-xl w-full bg-gradient-to-r from-[#2c6d67] to-blue-500 text-white font-semibold py-3 rounded-2xl hover:opacity-80 transition">
              Reserva
            </button>

            <p className="text-center text-xs text-gray-500">
              Pasarás a checkout para proceder con el pago
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );

}

export default PostDetail;
