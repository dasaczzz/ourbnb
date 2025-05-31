import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Input } from '../primitives/Input'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import config from '../../lib/config'

export interface PublishHandle {
  getData: () => {
    night_cost: number
  };
  isValid: boolean;
}

interface Props {
  onValidationChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Publish = forwardRef<PublishHandle, Props>(({ onValidationChange }, ref)  => {
  const [night_cost, setNight_cost] = useState(0)
  const draftLocation = useSelector((state: RootState) => state.post.draftPost.location)
  const [mapEmbedUrl, setMapEmbedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (draftLocation && draftLocation.location) {
      setLoading(true)
      setError(null)
      const encodedAddress = encodeURIComponent(draftLocation.location)
      const url = `https://www.google.com/maps/embed/v1/place?key=${config.maps_api}&q=${encodedAddress}&zoom=15`
      setMapEmbedUrl(url)
      setLoading(false)
    } else {
      setError('No se ha proporcionado una ubicación para mostrar en el mapa.')
      setLoading(false)
      setMapEmbedUrl(null)
    }
  }, [draftLocation])
  const currentIsValid = night_cost != 0

  useImperativeHandle(ref, () => ({
      getData: () => ({
        night_cost
      }),
      isValid: currentIsValid
    }))

  useEffect(() => {
    onValidationChange(currentIsValid)
  }, [currentIsValid, onValidationChange])

  if (loading) {
    return <div className="text-center p-4">Cargando mapa...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  if (!mapEmbedUrl) {
    return <div className="text-center p-4 text-muted-foreground">No hay mapa disponible para mostrar.</div>
  }

  const handleNight_costChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNight_cost(parseInt(event.target.value))
  }
  return (
    <div className='flex flex-col gap-4 w-1/2 '>
      <h2 className='text-2xl font-bold'>Establece un precio</h2>
      <input type='number' className='font-bold text-6xl text-center' value={night_cost} onChange={handleNight_costChange}/>
      <hr className='py-2'/>
      <h2 className='text-2xl font-bold'>Define unas reglas para el hogar</h2>
      <Input
        text='Comparte lo que deseas que se cumpla en tu hogar'
        type="text"
        placeholder="Descripción de tu espacio"

      />
      <hr className='py-2'/>
      <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>Establece un precio</h2>
      <div className='rounded-md overflow-hidden shadow-lg'>
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de tu anuncio"
        ></iframe>
      </div>
    </div>
    </div>
  )
})
