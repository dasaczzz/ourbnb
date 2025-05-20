import { FaSearch } from 'react-icons/fa'
import { IconButton } from './IconButton'
import { useState, useEffect, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { startGetPosts, startSearchPosts } from '../../store/thunks/postThunk'

interface SearchBarProps {
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Destino" }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    if (searchQuery.trim() === '') {
      dispatch(startGetPosts())
    } else {
      dispatch(startSearchPosts(searchQuery))
    }
  }, [searchQuery, dispatch])

  return (
    <div className="flex gap-6 items-center p-4 bg-secondary-200 rounded-full my-2 shadow-md">
      <input
        type="text"
        placeholder={placeholder}
        className="shadow-sm bg-white rounded-full px-4 py-2 text-secondary-400 focus:outline-1 focus:outline-secondary-500 flex-grow"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <IconButton icon={<FaSearch size={16} />} color="bg-primary-500" hoverColor="bg-primary-400" />
    </div>
  )
}
