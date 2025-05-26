import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { clearUser } from '../../store/slices/userSlice'
import { fetchLogout } from '../../lib/api'
import { toast } from 'sonner'
import { SearchBar } from '../primitives/SearchBar'
import { Button } from '../primitives/Button'

export const Navbar = () => {

  const { profilepic } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const defaultProfilePic = 'https://pub-e91187236c2541009a993bce3a8e29c8.r2.dev/default.JPG'

  const handleLogout = async () => {
    dispatch(logout({}))
    dispatch(clearUser())
    await fetchLogout()
    toast.success('Se ha cerrado la sesion con exito')
    navigate('/login')
  }

  return (
    <div className="container flex justify-between h-24">
      <div className="flex items-center gap-2.5">
        <Link to='/' className='flex justify-center items-center'>
          <img src="/ourbnb.svg" className='w-20 h-14' alt="logo empresarial" />
          <h1 className="font-bold text-primary-400 text-3xl">Ourbnb</h1>
        </Link>
      </div>

      {/* Show the search bar only in the index page */}
      {location.pathname === '/' && <SearchBar />}

      <div className='flex items-center gap-2'>
        <Link to='/newPost' className='text-lg'>Tu espacio en Ourbnb</Link>
        {/* division line */}
        <div className="border-l-2 h-9 border-secondary-400"></div>

        {/* Image and user menu */}
          <div className="relative group inline-block">

            { profilepic ?

            <div className="relative">
            <img src={profilepic && profilepic.trim() !== '' ? profilepic : defaultProfilePic} alt="Imagen de usuario" className='rounded-full object-cover object-center size-10 aspect-square'/>
            <div className="absolute left-full top-0 ml-0 opacity-0 bg-secondary-200 group-hover:opacity-100 transition-opacity duration-200 rounded-md hidden group-hover:block w-30">
              <Link to='/profile' className="block px-3 py-2 hover:text-primary-400 hover:font-semibold hover:bg-secondary-300">Perfil</Link>
              <span onClick={handleLogout} className="block px-3 py-2 hover:text-primary-400 hover:font-semibold hover:bg-secondary-300 cursor-pointer">Cerrar sesión</span>
            </div>
            </div>

            : 
            
            <Link to= '/login'>
              <Button intent='primary' className="px-4">Iniciar Sesión</Button>
            </Link>
            }
          </div>
      </div>
    </div>
  )
}
