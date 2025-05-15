import { useState, useEffect } from 'react'
import { UserForm } from '../components/profile/UserForm'
import { Modal } from '../components/primitives/Modal'
import { Button } from '../components/primitives/Button'
import { toast } from 'sonner'
import { fetchDeleteUser, fetchLogout, fetchPost } from '../lib/api'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../store/store'
import { logout } from '../store/slices/authSlice'
import { clearUser } from '../store/slices/userSlice'
import { useNavigate } from 'react-router-dom'
import { startGetBookingsByUser } from '../store/thunks/bookingThunk'
import { selectBookings } from '../store/slices/bookingSlice'
import { Link } from 'react-router-dom'

export const Profile = () => {

  const state = useSelector(state => state.user)
  const bookings = useSelector(selectBookings)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [posts, setPosts] = useState<{ [key: string]: any }>({})

  // controls for modal
  const handleOpenModal = () => { setOpen(true) }
  const handleCloseModal = () => { setOpen(false) }

  const handleDelete = async() => {
    const response = await fetchDeleteUser(state.id)
    if (!response) return toast.error('No se pudo eliminar tu usuario. Intentalo de nuevo')
    toast.success('Su usuario se ha eliminado con exito')
    dispatch(logout({}))
    await fetchLogout()
    dispatch(clearUser())
    navigate('/login')
  }

  const handleNavigate = () => {
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
      const postsData: { [key: string]: any } = {}
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

    <section className='flex items-center justify-center h-full py-4 flex-col gap-6'>

      {/* Reservaciones*/}
      <div className="flex-[0.6] min-w-0 w-full sm:max-w-[1000px]">
        <div className="p-5 flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Tus Reservaciones</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {bookings.map((item, index) => {
              const post = posts[item.post_id]
              if (!post) return null
              return (
                <Link to={`/post/${item.post_id}`} key={`${item.post_id}-${index}`} className="bg-white rounded-3xl shadow-md p-6 max-w-xs flex flex-row gap-4">
                  <div className="overflow-hidden rounded-xl mb-4 flex-shrink-0 w-24 h-24">
                    <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover rounded-xl"/>
                  </div>

                  <div className="flex flex-col justify-between">
                    <h2 className="font-semibold text-lg mb-1">{post.title}</h2>
                    <p className="text-gray-700 mb-1"> {item.init_date ? formatDate(item.init_date) : ''} – {item.end_date ? formatDate(item.end_date) : ''} </p>
                    <p className="text-gray-600 mb-1"> {item.users.length || 1} huésped{(item.users.length || 1) > 1 ? 'es' : ''} </p>

                    <p className="text-gray-600 font-semibold"> Total pagado{' '}
                      {item.total_cost.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      })}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
          
          {/* si no hay reservas */}
          {!bookings.length && (
            <div className='flex items-center'>
              <p className="text-sm text-gray-500 mr-1.5">Aquí verás tus reservaciones.</p>
              <button className="bg-gradient-to-r from-[#2c6d67] to-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:opacity-80 transition" onClick={handleNavigate}>¡Hagamos la primera!</button>
            </div>
          )}
        </div>
      </div>

       {/* Perfil*/}
      <h2 className='font-bold text-3xl'>Tu perfil</h2>
      <UserForm handleOpenModal={handleOpenModal} />

      <Modal title='Se eliminará tu cuenta' isOpen={open} closeModal={handleCloseModal}>
        <div className='flex flex-col gap-4'>
          <p className='text-lg'>Todos tus datos seran eliminados. Si quieres volver a acceder deberas crear nuevamente una cuenta.</p>
          <div className='w-1/2 flex gap-3 items-end justify-end'>
            <Button intent='secondary' onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleDelete} intent='primary'>Aceptar</Button>
          </div>
        </div>
      </Modal>
    </section>
  )
}
