import { InputHTMLAttributes } from 'react'

interface props extends InputHTMLAttributes<HTMLInputElement> {
 text: string
}

export const Input: React.FC<props> = ({text, ...props}) => {
  return (
    <label className="text-lg mb-1">
      {text}
      <input className="w-full shadow-sm rounded-md px-4 py-2 text-secondary-400 mb-4 focus:outline-1 outline-secondary-400" {...props}/>
    </label>
  )
}
