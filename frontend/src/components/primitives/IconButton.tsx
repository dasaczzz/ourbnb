import { ButtonHTMLAttributes } from 'react'

interface props extends ButtonHTMLAttributes<HTMLButtonElement>  {
  icon: React.ReactElement
  color: string // primary or secondary
  hoverColor: string
}

export const IconButton: React.FC<props> = ({ icon, color, hoverColor,...props }) => {
  return (
    <button {...props} className={`${color} text-secondary-200 rounded-full p-3 cursor-pointer hover:${hoverColor}`} >{icon}</button>
  )
}
