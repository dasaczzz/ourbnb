import { useState } from 'react'
import { LoginForm } from '../../components/auth/LoginForm'
import { Modal } from '../../components/generics/Modal'
import { RegisterForm } from '../../components/auth/RegisterForm'

export const Login = () => {

  const [open, setOpen] = useState(false)

  // controls for modal
  const handleOpenModal = () => { setOpen(true) }
  const handleCloseModal = () => { setOpen(false) }

  return (
    <div className="flex flex-col w-1/2 bg-secondary-200 h-screen justify-center items-center">
      <section className="w-1/2 flex flex-col gap-10">

        {/* logo and title  */}
        <div className="flex gap-4 justify-center items-center">
          <img src="ourbnb.svg" className='w-32 h-24' alt="logo empresarial" />
          <h1 className="font-bold text-primary-400 text-6xl">Ourbnb</h1>
        </div>

        <LoginForm />

        {/* Create account */}
        <div className='flex flex-col gap-3'>
          <hr/>
          <div className="flex justify-center gap-2 text-lg">
            <span>¿No tienes una cuenta?</span>
            <button onClick={handleOpenModal} className="hover:underline underline-offset-4 hover:text-primary-300" >crear una cuenta</button>
          </div>
        </div>
      </section>

      {/* deconstruct modal to allow form reset */}
      {open && (
        <Modal title='Crea una cuenta!' isOpen={open} closeModal={handleCloseModal}>
          <RegisterForm />
        </Modal>
      )}

    </div>
  )
}
