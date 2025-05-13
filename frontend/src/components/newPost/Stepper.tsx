export const Stepper = () => {
  return (
    <ol className="container items-center flex justify-around w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
      <li className="flex flex-col gap-2 items-center text-primary-400 space-x-2.5 rtl:space-x-reverse">
        <span className="flex items-center justify-center w-10 h-10 border-2 border-primary-400 text-primary-400 text-lg font-semibold rounded-full shrink-0">
          1
        </span>
        <span>
          <h3 className="font-bold text-xl leading-tight">Describe tu espacio</h3>
        </span>
      </li>
      <li className="flex flex-col gap-2 items-center text-secondary-400 space-x-2.5 rtl:space-x-reverse">
        <span className="flex items-center justify-center w-10 h-10 border-2 border-secondary-400 text-secondary-400 text-lg font-medium rounded-full shrink-0">
          2
        </span>
        <span>
          <h3 className="font-medium text-lg leading-tight">Haz que destaque</h3>
        </span>
      </li>
      <li className="flex flex-col gap-2 items-center text-secondary-400 space-x-2.5 rtl:space-x-reverse">
        <span className="flex items-center justify-center w-10 h-10 border-2 border-secondary-400 text-secondary-400 text-lg font-medium rounded-full shrink-0">
          3
        </span>
        <span>
          <h3 className="font-medium text-lg leading-tight">Terminar y publicar</h3>
        </span>
      </li>

    </ol>
  )
}
