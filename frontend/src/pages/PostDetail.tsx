import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { startGetPost } from '../store/thunks/postThunk'
import { AppDispatch, RootState } from '../store/store'
import { fetchUserById, UserResponse, createBooking } from '../lib/api'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

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
  const ourbnbServiceCost = useSelector((state: RootState) => state.booking.ourbnbServiceCost)
  const [host, setHost] = useState<UserResponse | null>(null)

  const [fechaLlegada, setFechaLlegada] = useState<string>('')
  const [fechaSalida, setFechaSalida] = useState<string>('')
  const [nightNumber, setNightNumber] = useState<number>(0)
  const [priceWithNights, setPriceWithNights] = useState<number>(0)
  const [priceToPrintWithNights, setPriceToPrintWithNights] = useState<string>('')
  const [bookingPrice, setBookingPrice] = useState<number>(0)
  const [bookingPriceToPrint, setBookingPriceToPrint] = useState<string>("")
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(post ? new Array(post.images.length).fill(false) : [])

  const user = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!fechaLlegada || !fechaSalida || !post || !user?.id) {
      alert('Por favor completa todas las fechas')
      return
    }

    const init_date = new Date(fechaLlegada)
    const end_date = new Date(fechaSalida)
    const post_id = post.id
    const service_cost = ourbnbServiceCost
    const total_cost = (post.night_cost * nightNumber) + service_cost
    const users = [user.id]

    const bookingData = {
      init_date,
      end_date,
      post_id,
      service_cost,
      total_cost,
      users
    }

    try {
      await createBooking(bookingData)
      toast.success('Reservación creada con éxito')
      navigate(`/bookingConfirmation/${post.id}`, { state: { bookingData } })

    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error al crear reservación: ' + error.message)
      } else {
        toast.error('Error desconocido al crear reservación')
      }
    }
  }
  
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

  // Calcular número noches
  useEffect(() => {
    if (fechaLlegada && fechaSalida) {
      const llegada = new Date(fechaLlegada)
      const salida = new Date(fechaSalida)
      const diffTime = salida.getTime() - llegada.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNightNumber(diffDays > 0 ? diffDays : 0)
    } else {
      setNightNumber(0)
    }
  }, [fechaLlegada, fechaSalida])

  // Calcular priceToPrintWithNights
  useEffect(() => {
    if (nightNumber && post?.night_cost ) {
      const price = (nightNumber * post.night_cost)
      const priceToPrintWithNights = price.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'COP',
      })
      setPriceWithNights(price)
      setPriceToPrintWithNights(priceToPrintWithNights)
    } else {
      setPriceToPrintWithNights("")
    }
  }, [nightNumber, post])

  // Calcular bookingPrice
  useEffect(() => {
    if (priceWithNights && ourbnbServiceCost) {
      const bookingPrice = (priceWithNights + ourbnbServiceCost)
      const bookingPriceToPrint = bookingPrice.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'COP',
      })
      setBookingPrice(bookingPrice)
      setBookingPriceToPrint(bookingPriceToPrint)
    } else {
      setBookingPrice(0)
    }
  }, [priceWithNights, ourbnbServiceCost])

  if (!post) {
    return <div>Cargando...</div>
  }

  const priceToPrint = post.night_cost.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'COP',
  })

  const ourbnbServiceCostToPrint = ourbnbServiceCost.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'COP',
      })

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
        <div className="col-span-1 md:col-span-2 h-full">
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
            <motion.img
              key={i}
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
          ))}
        </div>
      </div>

      

      {/* Sección de columnas */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Columna izquierda */}
        <div className="flex-1">
          <Link to={`/HostProfile/${host?.id}`} className="flex items-center gap-1.5 mb-4 border border-gray-300 rounded-2xl p-2 shadow-md w-fit hover:bg-gradient-to-r hover:from-[#2c6d67] hover:to-blue-500 hover:text-white transition">
            <img src={host ? host.profilepic : "?"} className="rounded-full object-cover object-center size-8 aspect-square" alt="Foto del anfitrión"/>
            <p className="font-bold">Anfitrión:</p>
            <p>{host ? host.name : 'Cargando Anfitrión'}</p>
          </Link>

          <hr />

          <p className="font-bold text-xl mt-4 mb-1">Acerca de este lugar</p>
          <p className="text-gray-600 text-sm mb-4">{post.description}</p>

          <hr />

          <p className="font-bold text-xl mt-4 mb-1">Lo que este lugar ofrece</p>
        </div>

        {/* Columna derecha */}
        <div className="w-full lg:w-[360px]">
          <div className="mt-3 p-5 shadow-lg border border-gray-300 rounded-2xl flex flex-col gap-3">
            <div className='flex items-center gap-1'>
              <p className="text-2xl font-bold">{priceToPrint}</p>
              <p className="text-xl">noche</p>
            </div>

            {/* formulario*/}
            <form onSubmit={handleSubmit}>
            {/* Selector de fechas */}
            <div className="shadow-md grid grid-cols-2 gap-2 border border-gray-300 rounded-lg overflow-hidden mb-2">
              <div className="flex flex-col border-r border-gray-300 px-3 py-2">
                <label className="text-xs font-semibold text-gray-500 mb-1">Llegada</label>
                <input type="date" className="text-xs text-gray-700" value={fechaLlegada} onChange={e => setFechaLlegada(e.target.value)} />
              </div>
              <div className="flex flex-col px-3 py-2">
                <label className="text-xs font-semibold text-gray-500 mb-1">Salida</label>
                <input type="date" className="text-xs text-gray-700" value={fechaSalida} onChange={e => setFechaSalida(e.target.value)} />
              </div>
            </div>

            {/* Selector de huéspedes */}
            <div className="shadow-md border border-gray-300 rounded-lg overflow-hidden mb-2">
              <div className="flex flex-col px-3 py-2">
                <label className="text-xs font-semibold text-gray-500 mb-1">Huéspedes</label>
                <input type="text" className="text-xs text-gray-700" placeholder="Seleccionar huesped" />
              </div>
            </div>

            <button type="submit" className="shadow-xl w-full bg-gradient-to-r from-[#2c6d67] to-blue-500 text-white font-semibold py-3 rounded-2xl hover:opacity-80 transition">
              Reservar
            </button>
            
            </form>

            <div className='flex justify-between'>
              <p className="text-sm">{priceToPrint} x {nightNumber} noches </p>
              { priceToPrint && fechaSalida ?
               <p className="text-sm underline">{priceToPrintWithNights}</p> : ""}
            </div>
            <div className='flex justify-between'>
              <p className="text-sm">Tarifa por servicio de Ourbnb</p>
              { ourbnbServiceCostToPrint && fechaSalida ?
               <p className="text-sm underline">{ourbnbServiceCostToPrint}</p> : ""}
            </div>
              
            <hr />
            { bookingPrice && bookingPriceToPrint ?
              <p className="text-sm underline text-right">Total: {bookingPriceToPrint}</p>
              : ""
            }

          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default PostDetail;
