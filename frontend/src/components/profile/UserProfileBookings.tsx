import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectBookings } from '../../store/slices/bookingSlice'
import { fetchDeleteBooking, fetchPost } from '../../lib/api'
import { toast } from 'sonner'
import { AppDispatch } from '../../store/store'
import { startGetBookingsByUser } from '../../store/thunks/bookingThunk'
import { Link, useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../primitives/LoadingSpinner'
import { Button } from '../primitives/Button'

export const UserProfileBookings = () => {
  const state = useSelector((state:any) => state.user)
  const [posts, setPosts] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [confirming, setConfirming] = useState<Record<string, boolean>>({})
  const bookings = useSelector(selectBookings)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleDeleteBooking = async(id: string) => {
    if (!confirming[id]) {
      setConfirming(prev => ({ ...prev, [id]: true }))
      return
    }

    setLoading(prev => ({ ...prev, [id]: true }))
    const response = await fetchDeleteBooking(id)
    if (!response) {
      toast.error('No se pudo cancelar la reservación.')
      setLoading(prev => ({ ...prev, [id]: false }))
      setConfirming(prev => ({ ...prev, [id]: false }))
      return
    }
    toast.success('Reservación cancelada con éxito.')
    await dispatch(startGetBookingsByUser(state.id))
    setConfirming(prev => ({ ...prev, [id]: false }))
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

  const getBookingStatus = (initDate: string | Date) => {
    const today = new Date()
    const bookingDate = new Date(initDate)
    const diffTime = bookingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: 'Ya pasó', color: 'text-gray-500', daysDiff: diffDays }
    } else if (diffDays <= 7) {
      return { text: 'Siguiente reserva', color: 'text-blue-500', daysDiff: diffDays }
    } else {
      return { text: 'Próximamente', color: 'text-green-500', daysDiff: diffDays }
    }
  }

  const sortedBookings = [...bookings].sort((a, b) => {
    const statusA = getBookingStatus(a.init_date)
    const statusB = getBookingStatus(b.init_date)
    return statusA.daysDiff - statusB.daysDiff
  })

  return (
    <div className="mx-10 flex-[0.6] w-full sm:max-w-[1000px]">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Tus Reservaciones</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 rounded-xl">
          {sortedBookings.map((item, index) => {
            const post = posts[item.post_id]
            if (!post) return null
            const status = getBookingStatus(item.init_date)
            return (
              <div
                key={`${item.post_id}-${index}`}
                className="bg-white rounded-2xl shadow-lg p-3 border border-gray-100 max-w-xs flex flex-row gap-4 transition duration-200 hover:bg-gray-100"
              >
                <div className="flex flex-col w-full">
                  <Link to={`/post/${item.post_id}`} className="flex flex-col w-full">
                    <div className="overflow-hidden rounded-xl mb-3 w-full h-40 flex-shrink-0">
                      <img src={post && (post as any).images && (post as any).images.length > 0 ? (post as any).images[0] : '/placeholder.jpg'} alt={post && (post as any).title ? (post as any).title : 'Hospedaje'} className="w-full h-full object-cover rounded-xl"/>
                    </div>
                    <div className="flex flex-col justify-between px-1">
                      <h2 className="font-semibold text-lg mb-1">{post && (post as any).title}</h2>
                      <p className="text-gray-600 font-semibold mb-2">
                        {item.init_date ? formatDate(item.init_date) : ''} – {item.end_date ? formatDate(item.end_date) : ''}
                      </p>
                      <p className="text-gray-600 font-semibold mb-2">
                        {item.users.length || 1} huésped{(item.users.length || 1) > 1 ? 'es' : ''}
                      </p>
                      <p className={`font-semibold mb-2 ${status.color}`}>
                        {status.text}
                      </p>
                      <p className="font-semibold mb-2">
                        Total pagado{' '}
                        {item.total_cost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                      </p>
                    </div>
                  </Link>
                  <div className="px-1">
                    <Button 
                      intent={confirming[item.id] ? "cancelFade" : "cancel"}
                      onClick={() => handleDeleteBooking(item.id)}
                      className="text-sm py-2 w-full transition-all duration-200"
                      disabled={loading[item.id]}
                    >
                      {loading[item.id] ? <LoadingSpinner /> : confirming[item.id] ? 'Confirmar' : 'Cancelar reservación'}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

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
