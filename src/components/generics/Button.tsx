import { ButtonHTMLAttributes } from 'react'

interface props extends ButtonHTMLAttributes<HTMLButtonElement>  {
  text: string,
}

export const Button: React.FC<props> = ({text, ...props}) => {
  return (
    <button {...props} className="w-full bg-primary-400 rounded-md text-secondary-200 text-lg font-medium py-3 hover:bg-primary-300 cursor-pointer transition-colors">{text}</button>
  )
}
