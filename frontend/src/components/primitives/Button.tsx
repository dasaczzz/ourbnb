import { cva, type VariantProps } from 'cva'

const variants = cva(
  'w-full rounded-xl text-lg font-medium py-3 px-2 cursor-pointer transition-all duration-300',
  {
    variants: {
      intent: {
        primary: 'bg-primary-400  text-secondary-200  hover:bg-primary-300',
        secondary: ' outline-1 text-primary-400 outline-primary-400 hover:text-primary-500 hover:outline-primary-500 hover:underline',
        fade: 'shadow-xl w-full bg-gradient-to-r from-[#2c6d67] via-blue-500 to-[#2c6d67] text-white font-semibold py-3 rounded-3xl hover:opacity-80 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] bg-[length:200%_100%] animate-gradient',
        strong: 'bg-primary-500  text-secondary-200  hover:bg-primary-400',
        cancel: 'outline-1 text-primary-400 outline-primary-400 hover:text-red-400 hover:outline-red-400',
        cancelFade: 'bg-gradient-to-r from-[#800000] to-[#d15700] text-white text-sm py-2 rounded-lg hover:opacity-80 transition'
      }
    }
  }
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof variants>

export const Button: React.FC<ButtonProps> = ({intent, className, ...props}) => {
  return (
    <button {...props} className={variants({intent, className})} />
  )
}
