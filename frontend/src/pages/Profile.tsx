import { useState } from 'react'
import { UserForm } from '../components/generics/UserForm'
import { Modal } from '../components/primitives/Modal'
import { Button } from '../components/primitives/Button'

export const Profile = () => {

  const [open, setOpen] = useState(false)

  // controls for modal
  const handleOpenModal = () => { setOpen(true) }
  const handleCloseModal = () => { setOpen(false) }

  return (
    <section className='flex items-center justify-center h-full py-4 flex-col gap-6'>
      <h2 className='font-bold text-3xl'>Tu perfil</h2>
      <UserForm handleOpenModal={handleOpenModal} />

      <Modal title='Se eliminará tu cuenta' isOpen={open} closeModal={handleCloseModal}>
        <div className='flex flex-col gap-4'>
          <p className='text-lg'>Todos tus datos seran eliminados. Si quieres volver a acceder deberas crear nuevamente una cuenta.</p>
          <div className='w-1/2 flex gap-3 items-end justify-end'>
            <Button intent='secondary' onClick={handleCloseModal}>Cancelar</Button>
            <Button intent='primary'>Aceptar</Button>
          </div>
        </div>
      </Modal>
    </section>
  )
}
