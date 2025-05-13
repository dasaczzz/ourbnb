import { useState } from 'react'
import { UserForm } from '../components/profile/UserForm'
import { Modal } from '../components/primitives/Modal'
import { Button } from '../components/primitives/Button'
import { toast } from 'sonner'
import { fetchDeleteUser, fetchLogout } from '../lib/api'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../store/store'
import { logout } from '../store/slices/authSlice'
import { clearUser } from '../store/slices/userSlice'
import { useNavigate } from 'react-router-dom'

export const Profile = () => {

  const state = useSelector(state => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  // controls for modal
  const handleOpenModal = () => { setOpen(true) }
  const handleCloseModal = () => { setOpen(false) }

  const handleDelete = async() => {
    const response = await fetchDeleteUser(state.id)
    if (!response) return toast.error('No se pudo eliminar tu usuario. Intentalo de nuevo')
    toast.success('Su usuario se ha eliminado con exito')
    dispatch(logout({}))
    await fetchLogout()
    dispatch(clearUser())
    navigate('/login')
  }

  return (
    <section className='flex items-center justify-center h-full py-4 flex-col gap-6'>
      <h2 className='font-bold text-3xl'>Tu perfil</h2>
      <UserForm handleOpenModal={handleOpenModal} />

      <Modal title='Se eliminará tu cuenta' isOpen={open} closeModal={handleCloseModal}>
        <div className='flex flex-col gap-4'>
          <p className='text-lg'>Todos tus datos seran eliminados. Si quieres volver a acceder deberas crear nuevamente una cuenta.</p>
          <div className='w-1/2 flex gap-3 items-end justify-end'>
            <Button intent='secondary' onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleDelete} intent='primary'>Aceptar</Button>
          </div>
        </div>
      </Modal>
    </section>
  )
}
