import { useState } from 'react'
import { Button } from '../primitives/Button'
import { FaHome, FaDoorClosed, FaDivide } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { updateDraftPost } from '../../store/slices/postSlice'
import config from '../../lib/config'
import { Input } from '../primitives/Input'

const options = [
  {
    title: 'Alojamiento entero',
    description: 'Los huéspedes disponen del alojamiento entero para ellos.',
    icon: <FaHome size={28} />,
  },
  {
    title: 'Una habitación',
    description: 'Los huéspedes tiene una habitación propia con acceso a espacios compartidos.',
    icon: <FaDoorClosed size={28} />,
  },
  {
    title: 'Habitación compartida',
    description: 'Los huéspedes duermen en una habitación que comparten.',
    icon: <FaDivide size={28} />,
  },
]

export const Describe = () => {
  const dispatch = useDispatch()
  const [selected, setSelected] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [address, setAddress] = useState('')
  const [mapUrl, setMapUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value)
    setError(null) // Clear previous errors when input changes
  }

  const handleGeocode = async () => {
    if (!address.trim()) {
      setError('Por favor, ingresa una dirección.')
      return
    }

    setLoading(true)
    setError(null)
    setMapUrl('')

    try {
      const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${config.maps_api}`

      const response = await fetch(geocodingApiUrl)
      const data = await response.json()

      if (data.status === 'OK') {
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location

          const newMapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
          setMapUrl(newMapUrl)
        } else {
          setError('No se encontraron resultados para la dirección.')
        }
      } else {
        setError(`Error de Geocoding: ${data.status} - ${data.error_message || 'Desconocido'}`)
      }
    } catch (err) {
      setError('Error al conectar con el servicio de Geocoding. Revisa tu conexión a internet.')
      console.error('Error fetching geocoding data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = () => {
    if (!selected) {
      setMessage('Debes seleccionar una opción')
      return
    }
    dispatch(updateDraftPost({ type: selected }))
    setMessage('')
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">
        ¿De qué tipo de alojamiento dispondrán los huéspedes?
      </h2>

      <div className="space-y-4">
        {options.map((opt) => (
          <button
            key={opt.title}
            onClick={() => setSelected(opt.title)}
            className={`w-full flex items-center justify-between border rounded-lg p-4 shadow-sm text-left transition
              ${
                selected === opt.title
                  ? 'bg-secondary-300 border-primary-500'
                  : 'bg-secondary-200 hover:bord border-transparent'
              }`}
          >
            <div>
              <h3 className="text-md font-semibold">{opt.title}</h3>
              <p className="text-sm text-muted-foreground">{opt.description}</p>
            </div>
            <div className="text-primary-500">{opt.icon}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className='w-1/3'>
          <Button onClick={handleSelect} intent="primary">
            Seleccionar
          </Button>
        </div>
        <span className='font-light text-sm text-red-500'>{message}</span>
      </div>
      <hr />
      <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>Donde se encuentra tu espacio</h2>
      <div className='flex gap-8'>
        <Input
          text='Ubicacion, ciudad, pais'
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Ej: Calle 100 #15-50, Bogotá"
        />
        <Button
          onClick={handleGeocode}
          disabled={loading}
          intent='secondary'
          className='h-12'
        >
          {loading ? 'Buscando...' : 'Buscar Ubicación'}
        </Button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {mapUrl && (
        <div className='rounded-md'>
          <iframe
            src={mapUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de la publicación"
          ></iframe>
        </div>
      )}

      {!mapUrl && !loading && !error && (
        <p>Ingresa una dirección para verla en el mapa.</p>
      )}
    </div>
    </div>
  )
}

