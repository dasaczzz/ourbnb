import { IconButton } from './IconButton'
import { FaSearch } from 'react-icons/fa'

export const Navbar = () => {
  return (
    <div className="container flex justify-between h-24">
      <div className="flex items-center gap-2.5">
        <img src="ourbnb.svg" className='w-20 h-14' alt="logo empresarial" />
        <h1 className="font-bold text-primary-400 text-3xl">Ourbnb</h1>
      </div>

      <div className="flex gap-6 items-center p-4 bg-secondary-200 rounded-full my-2">
        <input type="text" placeholder="Destino" className="shadow-sm bg-white rounded-full px-4 py-2 text-secondary-400  focus:outline-1 focus:outline-secondary-500" />
        <IconButton icon={<FaSearch size={16}/>} color='bg-primary-500' hoverColor='bg-primary-400'/>
      </div>

      <div className='flex items-center gap-2'>
        <span className='text-lg'>Tu espacio en Ourbnb</span>
        {/* division line */}
        <div className="border-l-2 h-9 border-secondary-400"></div>
      </div>
    </div>
  )
}
