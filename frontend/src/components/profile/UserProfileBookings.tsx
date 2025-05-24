import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectBookings } from '../../store/slices/bookingSlice'
import { fetchDeleteBooking, fetchPost } from '../../lib/api'
import { toast } from 'sonner'
import { AppDispatch } from '../../store/store'
import { startGetBookingsByUser } from '../../store/thunks/bookingThunk'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export const UserProfileBookings = () => {

  const state = useSelector((state:any) => state.user)
  const [posts, setPosts] = useState<Record<string, unknown>>({})
  const bookings = useSelector(selectBookings)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleDeleteBooking = async(id: string) => {
    const response = await fetchDeleteBooking(id)
    if (!response) {
      toast.error('No se pudo cancelar la reservación.')
      return
    }
    toast.success('Reservación cancelada con éxito.')
    await dispatch(startGetBookingsByUser(state.id))
    navigate('/')
  }

  useEffect(() => {
    const getBookingsByUser = async() => {
      if (typeof state.id === 'string') {
        await dispatch(startGetBookingsByUser(state.id))
      }
    }

    getBookingsByUser()
  }, [dispatch, state.id])

  useEffect(() => {
    const fetchPosts = async () => {
      const postsData: Record<string, unknown> = {}
      for (const booking of bookings) {
        if (!postsData[booking.post_id]) {
          const post = await fetchPost(booking.post_id)
          postsData[booking.post_id] = post
        }
      }
      setPosts(postsData)
    }
    if (bookings.length > 0) {
      fetchPosts()
    }
  }, [bookings])

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="mx-10 flex-[0.6] w-full sm:max-w-[1000px]">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Tus Reservaciones</h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 shadow-xl rounded-xl"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {bookings.map((item, index) => {
            const post = posts[item.post_id]
            if (!post) return null
            return (
              <motion.div
                key={`${item.post_id}-${index}`}
                className="bg-white rounded-2xl shadow-md p-3 max-w-xs flex flex-row gap-4 transition duration-200 hover:bg-gray-100"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link to={`/post/${item.post_id}`} className="flex flex-col w-full ">
                  <div className="overflow-hidden rounded-xl mb-3 w-full h-40 flex-shrink-0">
                    <img
                      src={post && (post as any).images && (post as any).images.length > 0 ? (post as any).images[0] : '/placeholder.jpg'}
                      alt={post && (post as any).title ? (post as any).title : 'Hospedaje'}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col justify-between px-1">
                    <h2 className="font-semibold text-lg mb-1">{post && (post as any).title}</h2>
                    <p className="text-gray-700 mb-1">{item.init_date ? formatDate(item.init_date) : ''} – {item.end_date ? formatDate(item.end_date) : ''}</p>
                    <p className="text-gray-600 mb-1">{item.users.length || 1} huésped{(item.users.length || 1) > 1 ? 'es' : ''}</p>
                    <p className="text-gray-600 font-semibold mb-2">Total pagado{' '}
                      {item.total_cost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                    </p>
                    <button onClick={() => handleDeleteBooking(item.id)} className="bg-gradient-to-r from-[#800000] to-[#d15700] text-white text-sm py-2 rounded-lg hover:opacity-80 transition">Cancelar reservación</button>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* si no hay reservas */}
        {!bookings.length && (
          <div className='flex items-center'>
            <p className="text-sm text-gray-500 mr-1.5">Aquí verás tus reservaciones.</p>
            <button className="bg-gradient-to-r from-[#2c6d67] to-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:opacity-80 transition" onClick={() => navigate('/')}>
              ¡Hagamos la primera!
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
