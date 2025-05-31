import { useState, useRef } from 'react'
import { Stepper } from '../components/newPost/Stepper'
import { Button } from '../components/primitives/Button'
import { Describe, DescribeHandle } from '../components/newPost/Describe'
import { toast } from 'sonner'
import { Highlight, HighlightHandle } from '../components/newPost/Highlight'
import { Publish, PublishHandle } from '../components/newPost/Publish'
import { useDispatch, useSelector } from 'react-redux'
import { updateDraftPost } from '../store/slices/postSlice'
import { startCreatePost } from '../store/thunks/postThunk'
import { AppDispatch, RootState } from '../store/store'

export const NewPost = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { draftPost } = useSelector((state: RootState) => state.post)
  const {id} = useSelector((state: RootState) => state.user)

  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const describeRef = useRef<DescribeHandle>(null)
  const highlightRef = useRef<HighlightHandle>(null)
  const publishRef = useRef<PublishHandle>(null)

  const steps = [
    { id: 1, component: <Describe ref={describeRef} onValidationChange={setIsCurrentStepValid}/> },
    { id: 2, component: <Highlight ref={highlightRef} onValidationChange={setIsCurrentStepValid}/> },
    { id: 3, component: <Publish ref={publishRef} onValidationChange={setIsCurrentStepValid}/> },
  ]

  const handleNextStep = () => {
    if (!isCurrentStepValid && currentStep < steps.length - 1) { // Only validate if not on the last step
      toast.error('Por favor, completa todos los datos para continuar.')
      return
    }

    switch (currentStep) {
      case 0: // Paso de Describe
        if (describeRef.current) {
          const describeData = describeRef.current.getData()
          if (describeData.type && describeData.location) {
             dispatch(updateDraftPost({
                type: describeData.type,
                location: describeData.location,
             }))
             toast.success('Información de ubicación y tipo de alojamiento guardada.')
          } else {
             toast.error('Datos incompletos para el paso "Describe".')
             return
          }
        } else {
          toast.error('Error interno: No se pudieron obtener los datos de Describe.')
          return
        }
        break
      case 1: // Paso de Highlight
        if (highlightRef.current) {
          const highlightData = highlightRef.current.getData()
          const images = highlightData.images.map(item => item.slice(5))
          dispatch(updateDraftPost({
            title: highlightData.title,
            description: highlightData.description,
            images,
            user_id: id,
          }))
          toast.success('Información de título, descripción e imágenes guardada.')
        } else {
          toast.error('Error interno: No se pudieron obtener los datos de Highlight.')
          return
        }
        break
      case 2:
        if (currentStep === steps.length - 1 && publishRef.current) {
          const publishData = publishRef.current.getData()
          if (draftPost) {
            dispatch(updateDraftPost({
            night_cost: publishData.night_cost,
            facilities: ['645a1b2c3d4e5f6789012346']
          }))
            dispatch(startCreatePost(draftPost))
          } else {
            toast.error('No hay datos de post para publicar.')
          }
        }
        break
      default:
        break
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <section className='container flex flex-col gap-8'>
      <Stepper currentStep={currentStep} />
      <div className="mb-4 flex flex-col items-center">{steps[currentStep].component}</div>

      <div className="flex gap-4">
        <Button
          intent='secondary'
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Atrás
        </Button>
        <Button
          intent='primary'
          onClick={handleNextStep}
        >
          {currentStep === steps.length - 1 ? 'Publicar' : 'Siguiente'}
        </Button>
      </div>
    </section>
  )
}
