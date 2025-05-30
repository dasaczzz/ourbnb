import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Button } from '../primitives/Button'
import { FaHome, FaDoorClosed, FaDivide } from 'react-icons/fa'
import config from '../../lib/config'
import { Input } from '../primitives/Input'
export interface DescribeHandle {
  getData: () => {
    type: string | null;
    location: {
      city: string;
      country: string;
      location: string;
    } | null;
  };
  isValid: boolean;
}

interface Props {
  onValidationChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Describe = forwardRef<DescribeHandle, Props>(({ onValidationChange }, ref) => {

  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [address, setAddress] = useState('')
  const [mapUrl, setMapUrl] = useState('')
  const [error, setError] = useState<string | null>(null) // Para errores de geocoding
  const [loading, setLoading] = useState(false)
  const [locationData, setLocationData] = useState<{ city: string; country: string; location: string } | null>(null)

  const currentIsValid = selectedType !== null && mapUrl !== '' && locationData !== null

  useEffect(() => {
    onValidationChange(currentIsValid)
  }, [currentIsValid, onValidationChange])

  useImperativeHandle(ref, () => ({
    getData: () => ({
      type: selectedType,
      location: locationData,
    }),
    isValid: currentIsValid,

  }))


  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value)
    if (error) setError(null)
    setLocationData(null)
    setMapUrl('')
  }

  const handleGeocode = async () => {
    if (!address.trim()) {
      setError('Por favor, ingresa una dirección.')
      setLocationData(null)
      setMapUrl('')
      return
    }

    setLoading(true)
    setError(null)
    setMapUrl('')
    setLocationData(null)

    try {
      const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${config.maps_api}`

      const response = await fetch(geocodingApiUrl)
      const data = await response.json()

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location
        const fullAddress = data.results[0].formatted_address

        let city = ''
        let country = ''

        for (const component of data.results[0].address_components) {
          if (component.types.includes('locality')) {
            city = component.long_name
          }
          if (component.types.includes('country')) {
            country = component.long_name
          }
        }

        const newMapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
        setMapUrl(newMapUrl)
        setLocationData({ city, country, location: fullAddress }) // Guardar los datos de ubicación
      } else {
        setError(`No se encontraron resultados para "${address}". Intenta ser más específico.`)
        setLocationData(null)
      }
    } catch (err) {
      setError('Error al conectar con el servicio de Geocoding. Revisa tu conexión a internet.')
      console.error('Error fetching geocoding data:', err)
      setLocationData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (title: string) => {
    setSelectedType(title)
  }

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

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">
        ¿De qué tipo de alojamiento dispondrán los huéspedes?
      </h2>

      <div className="space-y-4">
        {options.map((opt) => (
          <button
            key={opt.title}
            onClick={() => handleSelect(opt.title)}
            className={`w-full flex items-center justify-between border rounded-lg p-4 shadow-sm text-left transition
              ${
                selectedType === opt.title
                  ? 'bg-secondary-300 border-primary-500'
                  : 'bg-secondary-200 hover:border-primary-500 border-transparent'
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
      <hr />
      <div className='flex flex-col gap-4'>
        <h2 className='text-2xl font-bold'>Donde se encuentra tu espacio</h2>
        <div className='flex gap-8'>
          <Input
            text='Ubicación, ciudad, país'
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
          <p className="text-muted-foreground">Ingresa una dirección para verla en el mapa.</p>
        )}
      </div>
    </div>
  )
})

Describe.displayName = 'Describe'
