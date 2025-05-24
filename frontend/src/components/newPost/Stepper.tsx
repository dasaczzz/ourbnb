interface props {
  currentStep: number
}

export const Stepper: React.FC<props> = ({currentStep}) => {
  const steps = [
    { title: 'Describe tu espacio' },
    { title: 'Haz que destaque' },
    { title: 'Terminar y publicar' },
  ]

  return (
    <ol className="items-center flex justify-around w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep

        return (
          <li
            key={index}
            className={`flex flex-col gap-2 items-center ${
              isActive ? 'text-primary-500' : 'text-secondary-400'
            }`}
          >
            <span
              className={`flex items-center justify-center w-10 h-10 border-2 rounded-full text-lg font-semibold shrink-0
                ${
                  isActive
                    ? 'border-primary-500 text-primary-500'
                    : isCompleted
                    ? 'border-primary-300 text-primary-300'
                    : 'border-secondary-400 text-secondary-400'
                }
              `}
            >
              {index + 1}
            </span>
            <span>
              <h3
                className={`leading-tight ${
                  isActive ? 'font-bold text-xl' : isCompleted ? 'text-primary-300 text-lg' : 'font-medium text-lg'
                }`}
              >
                {step.title}
              </h3>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
