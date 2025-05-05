import { ReactNode } from 'react'
import { FaXmark } from 'react-icons/fa6'

interface props {
  title: string
  isOpen: boolean
  closeModal: () => void
  children: ReactNode
}

export const Modal: React.FC<props> = ({...props}) => {
  return (
    <dialog className={`${ props.isOpen ? 'flex' : 'hidden'} h-full w-full rounded bg-secondary-100 shadow bg-secondary-500/50 justify-center items-center`}>
      <div className='w-1/3 bg-secondary-300 rounded-md px-6 pt-6 pb-12 flex flex-col items-center gap-8'>
        <div className='flex justify-between w-full'>
          <h4 className='text-pretty text-4xl font-bold'>{props.title}</h4>
          <button className='text-primary-400 hover:text-primary-300' onClick={() => { props.closeModal() }}>
            <FaXmark size={36}/>
          </button>
        </div>
        {props.children}
      </div>
    </dialog>
  )
}
