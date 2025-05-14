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
    <div className="p-5 flex justify-center">
      <div className="flex gap-5 w-full rounded-lg p-5 bg-white ml-10">
        <div className="ml-2 flex-col justify-between">
          <div className={"flex gap-2 items-center justify-between mb-4"}>
            <h1 className="text-2xl font-bold ">{post.title}</h1>
            <h3 className="font-bold text-gray-900">{post.location.city}, {post.location.country}</h3>
          </div>

          {post.images && post.images.length > 0 && (
            <img className="w-150 rounded-2xl border border-gray-300 shadow-xl mb-4" src={post.images[0]} alt={post.title || 'Imagen del producto'} />
          )}
          
          {/* div de columnas */}
          <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
          
          <div className="flex items-center gap-1.5 mb-4">
            <img src={host ? host.profilepic : "?"} className='rounded-full object-cover object-center size-8 aspect-square'></img>
            <p className="font-bold">Anfitrión: </p>
            <p>{host ? host.name : 'Nombre no disponible'}</p>
          </div>

          <hr></hr>

          <p className="font-bold text-xl mb-0.2 mt-4">Acerca de este lugar</p>
          <p className="text-gray-600 text-sm mb-4">{post.description}</p>

          <hr></hr>

          <p className="font-bold text-xl mb-0.2 mt-4">Lo que este lugar ofrece</p>

          {/*cierro div y abro div 2da columna*/}
          </div>
          <div className="w-full lg:w-[360px]"></div>
      
          {/* Card de reserva */}
          <div className="mt-3 w-3/3 p-5 shadow-lg border border-gray-300 rounded-2xl flex flex-col gap-3">
            <div>
              <p className="text-xs text-gray-500 mt-2">
                Precio total sin impuestos
              </p>
              <p className="text-2xl font-bold">{priceToPrint} </p>
            </div>

            {/* Selector de fechas */}
            <div className=" shadow-xl grid grid-cols-2 gap-2 border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex flex-col border-r border-gray-300 px-3 py-2">
                <label className="text-xs font-semibold text-gray-500 mb-0.2">Llegada</label>
                <input type="date" className="text-xs text-gray-700" />
              </div>
              <div className="flex flex-col px-3 py-2">
                <label className="text-xs font-semibold text-gray-500 mb-0.2">Salida</label>
                <input type="date" className="text-xs text-gray-700"/>
              </div>
            </div>
            <div className="shadow-xl gap-2 border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex flex-col border-r border-gray-300 px-3 py-2">
                <label className="text-xs font-semibold text-gray-500 mb-0.2">Huespedes</label>
                <input type="selector" className="text-xs text-gray-700" />
              </div>
            </div>

            <button className="shadow-xl w-full bg-gradient-to-r from-[#2c6d67] to-blue-500 text-white font-semibold py-3 rounded-2xl hover:opacity-80 transition">
              Reserva
            </button>
            <p className="text-center text-xs text-gray-500">
              Pasarás a checkout para proceder con el pago
            </p>
          </div>

          {/*cierro divs columnas*/}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
