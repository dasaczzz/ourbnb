import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { startGetPosts } from '../store/thunks/postThunk'
import { PostState } from '../store/slices/postSlice'
import { HostCard } from '../components/index/HostCard'

export const Index = () => {

  const {posts} = useSelector((state: RootState) => state.post)
  const dispatch = useDispatch<AppDispatch>()

  // State for filters
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')

  // State for dropdown open/close
  const [filterOpen, setFilterOpen] = useState(false)

  // Filtered posts state
  const [filteredPosts, setFilteredPosts] = useState<PostState[]>([])

  useEffect(() => {
    const getPosts = async() => {
      await dispatch(startGetPosts())
    }

    getPosts()
  }, [dispatch])

  // Apply frontend filtering whenever posts or filters change
  useEffect(() => {
    let filtered = posts as PostState[]

    if (city) {
      filtered = filtered.filter(post =>
        post.location.city.toLowerCase().includes(city.toLowerCase())
      )
    }

    if (country) {
      filtered = filtered.filter(post =>
        post.location.country.toLowerCase().includes(country.toLowerCase())
      )
    }

    if (minPrice !== '') {
      filtered = filtered.filter(post =>
        post.night_cost !== null && post.night_cost >= (typeof minPrice === 'number' ? minPrice : 0)
      )
    }

    if (maxPrice !== '') {
      filtered = filtered.filter(post =>
        post.night_cost !== null && post.night_cost <= (typeof maxPrice === 'number' ? maxPrice : Number.MAX_SAFE_INTEGER)
      )
    }

    setFilteredPosts(filtered)
  }, [posts, city, country, minPrice, maxPrice])

  // Function to remove a filter
  const removeFilter = (filterName: string) => {
    switch(filterName) {
      case 'city':
        setCity('')
        break
      case 'country':
        setCountry('')
        break
      case 'minPrice':
        setMinPrice('')
        break
      case 'maxPrice':
        setMaxPrice('')
        break
    }
  }

  return (
    <>
      <div className=" flex container">
        <button
          type="button"
          className='relative border flex flex-col items-center w-30 rounded-xl shadow-md outline-1 text-primary-400 outline-primary-400 hover:text-primary-500 hover:outline-primary-500 hover:bg-gray-200 transition'
          onClick={() => setFilterOpen(!filterOpen)}
          aria-expanded={filterOpen}
          aria-haspopup="true"
        >
          Filtrar
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {filterOpen && (
          <div className="absolute transition origin-top-right  left-0 mt-2 ml-40 w-35 rounded-xl shadow-md bg-white/80 backdrop-blur-sm ring-1 ring-black ring-opacity-5 focus:outline-none z-10 p-4">
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input input-bordered border border-gray-300 shadow-sm hover:bg-gray-200 transition rounded-md p-1"
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input input-bordered border border-gray-300 shadow-sm hover:bg-gray-200 transition rounded-md p-1"
              />
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="input input-bordered border border-gray-300 shadow-sm hover:bg-gray-200 transition rounded-md p-1"
                min={0}
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="input input-bordered border border-gray-300 shadow-sm hover:bg-gray-200 transition rounded-md p-1"
                min={0}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mx-80">
        {city && (
          <span className="shadow-md inline-flex items-center rounded-full bg-primary-400 px-3 py-1 text-sm font-medium text-white">
            City: {city}
            <button
              type="button"
              className="ml-2 border border-gray-100/30 h-6 w-6 rounded-full text-green-500 hover:bg-green-700"
              onClick={() => removeFilter('city')}
            >
              &times;
            </button>
          </span>
        )}
        {country && (
          <span className="shadow-md inline-flex items-center rounded-full bg-primary-400 px-3 py-1 text-sm font-medium text-white">
            Country: {country}
            <button
              type="button"
              className="ml-2 text-green-500 border border-gray-100/30 h-6 w-6 rounded-full hover:bg-green-700"
              onClick={() => removeFilter('country')}
            >
              &times;
            </button>
          </span>
        )}
        {minPrice !== '' && (
          <span className="shadow-md inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            Min Price: {minPrice}
            <button
              type="button"
              className="ml-2 text-yellow-500 border border-yellow-600/40 h-6 w-6 rounded-full hover:bg-yellow-700/20"
              onClick={() => removeFilter('minPrice')}
            >
              &times;
            </button>
          </span>
        )}
        {maxPrice !== '' && (
          <span className="shadow-md inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
            Max Price: {maxPrice}
            <button
              type="button"
              className="ml-2 text-red-500 border border-red-600/20 h-6 w-6 rounded-full hover:bg-red-700/20"
              onClick={() => removeFilter('maxPrice')}
            >
              &times;
            </button>
          </span>
        )}
      </div>

      <section className="container flex justify-start items-start content-start flex-wrap py-8 gap-8 *:rounded-2xl">
        {filteredPosts.map((item: PostState) => (
          <HostCard post={item}/>
        ))
        }
      </section>
    </>
  )
}

