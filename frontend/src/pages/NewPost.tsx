import { useState } from 'react'
import { Stepper } from '../components/newPost/Stepper'
import { Button } from '../components/primitives/Button'
import { Describe } from '../components/newPost/Describe'

const StepTwo = () => <div>Paso 2</div>
const StepThree = () => <div>Paso 3</div>

const steps = [
  { id: 1, component: <Describe/> },
  { id: 2, component: <StepTwo /> },
  { id: 3, component: <StepThree /> },
]

export const NewPost = () => {

  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
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
      <Stepper currentStep={currentStep}/>
      <div className="mb-4">{steps[currentStep].component}</div>

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
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            >
              Siguiente
          </Button>
      </div>
    </section>
  )
}
