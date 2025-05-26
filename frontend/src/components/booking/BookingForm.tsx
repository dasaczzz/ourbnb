import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { startGetPost } from '../../store/thunks/postThunk'
import { AppDispatch, RootState } from '../../store/store'
import { createBooking } from '../../lib/api'
import { toast } from 'sonner'
import { fetchBookingsUsersValidate } from '../../lib/api'
import { Button } from '../primitives/Button'

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

const BookingForm = () => {
    const {post_id} = useParams()

    const dispatch = useDispatch<AppDispatch>()
    const post = useSelector((state: RootState) => state.post.post) as Post | null
    const ourbnbServiceCost = useSelector((state: RootState) => state.booking.ourbnbServiceCost)

    const [fechaLlegada, setFechaLlegada] = useState<string>('')
    const [fechaSalida, setFechaSalida] = useState<string>('')
    const [nightNumber, setNightNumber] = useState<number>(0)
    const [priceWithNights, setPriceWithNights] = useState<number>(0)
    const [priceToPrintWithNights, setPriceToPrintWithNights] = useState<string>('')
    const [bookingPrice, setBookingPrice] = useState<number>(0)
    const [bookingPriceToPrint, setBookingPriceToPrint] = useState<string>('')
    const user = useSelector((state: RootState) => state.user)
    const [huespedes, setHuespedes] = useState<string[]>([`${user.email}`])

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!post?.id) {
          toast.error("Entra a una publicación para reservar")
          return
        }
        if(!user?.id) {
          toast.error("Por favor, selecciona la fecha de llegada")
          return
        }
        if(!fechaSalida) {
          toast.error("Por favor, selecciona la fecha de salida")
          return
        }
        if (!fechaLlegada) {
          toast.error('Por favor, selecciona la fecha de llegada')
          return
        }

        const init_date = new Date(fechaLlegada)
        const end_date = new Date(fechaSalida)
        const post_id = post.id
        const service_cost = ourbnbServiceCost
        const total_cost = (post.night_cost * nightNumber) + service_cost

        let users
        try {
            users = await fetchBookingsUsersValidate(huespedes)
        } catch (error: any) {
            console.log('Error completo:', error)
            console.log('Error response:', error.response)
            console.log('Error data:', error.response?.data)
            if (error.details) {
                toast.error(error.details)
            } else if (error.error) {
                toast.error(error.error)
            }
            return
        }

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
        } catch (error: any) {
            if (error.response?.data?.details) {
                toast.error(error.response.data.details)
            } else if (error.response?.data?.error) {
                toast.error(error.response.data.error)
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
      setPriceToPrintWithNights('')
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

    const handleGuestEmailChange = (index: number, value: string) => {
        const newHuespedes = [...huespedes]
        newHuespedes[index] = value
        setHuespedes(newHuespedes)
    }

    const addGuestField = () => {
        setHuespedes([...huespedes, ''])
    }

    const removeGuestField = (index: number) => {
        const newHuespedes = huespedes.filter((_, i) => i !== index)
        setHuespedes(newHuespedes)
    }

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
              <input type="date" className="cursor-pointer text-xs text-gray-700" value={fechaLlegada} onChange={e => setFechaLlegada(e.target.value)} />
            </div>
            <div className="flex flex-col px-3 py-2">
              <label className="text-xs font-semibold text-gray-500 mb-1">Salida</label>
              <input type="date" className="cursor-pointer text-xs text-gray-700" value={fechaSalida} onChange={e => setFechaSalida(e.target.value)} />
            </div>
          </div>
          
          {/* Selector de huéspedes */}
          {user.id?
          <div className="shadow-md border border-gray-300 rounded-lg overflow-hidden mb-2">
            <div className="flex flex-col px-3 py-2">
              <label className="text-xs font-semibold text-gray-500 mb-1">Huéspedes</label>
              {huespedes.map((email, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                      <input type="email" value={email} onChange={e => handleGuestEmailChange(index, e.target.value)}
                          placeholder="Escribe el correo del huésped" className="text-xs text-gray-700 flex-1" />
                      {email !== user.email && (
                          <button type="button" onClick={() => removeGuestField(index)} className="cursor-pointer text-[#2c6d67] hover:text-gray-700">
                              ✕
                          </button>
                      )}
                  </div>
              ))}
              <button type="button" onClick={addGuestField} className="cursor-pointer text-[#2c6d67] hover:text-blue-500 text-sm font-bold flex items-center gap-1">
                  <span>+</span> Agregar otro huésped
              </button>
            </div>
          </div>
          : ""}
          
          {user.id? 
          <Button type="submit" intent="fade">
            Reservar
          </Button>

          :
          <div>
            <h3 className="text-[#2c6d67] text-xs font-bold flex items-center gap-1 mb-2">Deberás iniciar sesión para realizar tu reserva</h3>
            <Link to={"/login"}>
              <Button intent="primary">Iniciar Sesión</Button>
            </Link>
          </div>
          }

          </form>

          {user.id? 
          <div>
          <div className='flex justify-between'>
            <p className="text-xs">{priceToPrint} x {nightNumber} noches </p>
            { priceToPrint && fechaSalida ?
             <p className="text-sm underline">{priceToPrintWithNights}</p> : ''}
          </div>
          <div className='flex justify-between'>
            <p className="text-xs">Tarifa por servicio de Ourbnb</p>
            { ourbnbServiceCostToPrint && fechaSalida ?
             <p className="text-sm underline mb-2">{ourbnbServiceCostToPrint}</p> : ''}
          </div>

          <hr />
          { bookingPrice && bookingPriceToPrint ?
            <p className="text-sm text-right mt-2">Total: {bookingPriceToPrint}</p>
            : ''
          }
          </div>
          : ""}
        </div>
    )
}

export default BookingForm
