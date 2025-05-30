import { useState, useRef } from 'react'
import { Stepper } from '../components/newPost/Stepper'
import { Button } from '../components/primitives/Button'
import { Describe, DescribeHandle } from '../components/newPost/Describe' // Importa DescribeHandle
import { toast } from 'sonner'
import { Highlight, HighlightHandle } from '../components/newPost/Highlight'
import { Publish } from '../components/newPost/Publish'
import { useDispatch } from 'react-redux'
import { updateDraftPost } from '../store/slices/postSlice'

export const NewPost = () => {
  const dispatch = useDispatch()

  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const describeRef = useRef<DescribeHandle>(null)
  const highlightRef = useRef<HighlightHandle>(null)

  const steps = [
    // Pasa el ref a Describe
    { id: 1, component: <Describe ref={describeRef} onValidationChange={setIsCurrentStepValid}/> },
    { id: 2, component: <Highlight ref={highlightRef} onValidationChange={setIsCurrentStepValid}/> },
    { id: 3, component: <Publish /> },
  ]

  const handleNextStep = () => {
    if (!isCurrentStepValid) {
      toast.error('Por favor, completa todos los datos para continuar.')
      return
    }

    switch (currentStep) {
      case 0: // Paso de Describe
        if (describeRef.current) {
          const describeData = describeRef.current.getData()
          // Asegúrate de que locationData no sea null antes de despachar
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
          dispatch(updateDraftPost({
            title: highlightData.title,
            description: highlightData.description,
            images: highlightData.images,
          }))
        } else {
          toast.error('Error interno: No se pudieron obtener los datos de Highlight.')
          return
        }
        break
      case 2:

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
          disabled={!(currentStep < steps.length - 1)}
        >
          {currentStep === steps.length - 1 ? 'Publicar' : 'Siguiente'}
        </Button>
      </div>
    </section>
  )
}
