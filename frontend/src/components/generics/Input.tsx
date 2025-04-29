import { InputHTMLAttributes } from 'react'

interface props extends InputHTMLAttributes<HTMLInputElement> {
 text: string
 error?: string
}

export const Input: React.FC<props> = ({text, error, ...props}) => {
  return (
    <label className="flex flex-col w-full items-start gap-2">
      {text}
      <div className='flex flex-col w-full gap-1'>
        <input className={`${error ? 'outline-1 outline-red-400': ''}  shadow-sm bg-secondary-200 w-full rounded-md px-4 py-2 text-secondary-400  focus:outline-1 focus:outline-secondary-400`} {...props}/>
        {error && <span className='text-sm text-red-400'>{error}</span >}
      </div>
    </label>
  )
}
