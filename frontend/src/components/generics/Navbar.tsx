import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from '../primitives/IconButton'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { clearUser } from '../../store/slices/userSlice'
import { fetchLogout } from '../../lib/api'
import { toast } from 'sonner'

export const Navbar = () => {

  const {profilepic} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async() => {
    dispatch(logout({}))
    dispatch(clearUser())
    await fetchLogout()
    toast.success('Se ha cerrado la sesion con exito')
    navigate('/login')
  }

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

        {/* Image and user menu */}
        <div className="relative group inline-block">
          <img src={profilepic} alt="Imagen de usuario" className='rounded-full object-cover object-center size-10 aspect-square '/>
          <div className="absolute opacity-0 bg-secondary-200 group-hover:opacity-100 transition-opacity duration-200 rounded-md hidden group-hover:block w-36">
            <Link to='/profile' className="block px-4 py-2 hover:text-primary-400 hover:font-semibold hover:bg-secondary-300">Perfil</Link>
            <span onClick={handleLogout} className="block px-4 py-2 hover:text-primary-400 hover:font-semibold hover:bg-secondary-300 cursor-pointer">Cerrar sesión</span>
          </div>
        </div>
      </div>
    </div>
  )
}
