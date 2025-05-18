import { FaSearch } from 'react-icons/fa'
import { IconButton } from './IconButton'

export const SearchBar = () => {
  return (
    <div className="flex gap-6 items-center p-4 bg-secondary-200 rounded-full my-2 shadow-md">
      <input type="text" placeholder="Destino" className="shadow-sm bg-white rounded-full px-4 py-2 text-secondary-400  focus:outline-1 focus:outline-secondary-500" />
      <IconButton icon={<FaSearch size={16}/>} color='bg-primary-500' hoverColor='bg-primary-400'/>
    </div>
  )
}
