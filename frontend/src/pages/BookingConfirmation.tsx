import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { fetchPost, Post } from '../lib/api'

interface BookingData {
  init_date: Date
  end_date: Date
  post_id: string
  service_cost: number
  total_cost: number
  users: string[]
}

const BookingConfirmation = () => {
  const { post_id } = useParams<{ post_id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const bookingData = location.state?.bookingData as BookingData | undefined

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPost = async () => {
      if (!post_id) {
        setError('ID de publicación no proporcionado')
        setLoading(false)
        return
      }
      try {
        const fetchedPost = await fetchPost(post_id)
        setPost(fetchedPost)
      } catch (err) {
        setError('Error al cargar la publicación')
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [post_id])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!post) {
    return <div>No se encontró la publicación</div>
  }

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleButton = () => {
    navigate('/profile')
  }

  return (
    <div className="p-10 flex">

      <main className="flex flex-row justify-center items-center gap-20 flex-grow">
        {/* Tarjeta de reserva */}
        <div className="bg-white rounded-3xl shadow-lg p-6 max-w-xs">
          <div className="overflow-hidden rounded-xl mb-4">
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
          <h2 className="font-semibold text-lg mb-1">{post.title}</h2>
          <p className="text-gray-700 mb-1">
            {bookingData?.init_date ? formatDate(bookingData.init_date) : ''} – {bookingData?.end_date ? formatDate(bookingData.end_date) : ''}
          </p>
          <p className="text-gray-600 mb-1">
            {bookingData?.users.length || 1} huésped{(bookingData?.users.length || 1) > 1 ? 'es' : ''}
          </p>
          <p className="text-gray-600 font-semibold">
            Monto pagado{' '}
            {bookingData
              ? bookingData.total_cost.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })
              : ''}
          </p>
        </div>

        {/* Texto de confirmación */}
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Tu reservación está confirmada</h1>
          <button onClick={handleButton} className="bg-gradient-to-r from-[#2c6d67] to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-80 transition">
            Ir al perfil
          </button>
        </div>
      </main>
    </div>
  )
}

export default BookingConfirmation
