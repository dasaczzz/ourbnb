import { useState } from 'react'
import { LoginForm } from '../../components/auth/LoginForm'
import { Modal } from '../../components/primitives/Modal'
import { RegisterForm } from '../../components/auth/RegisterForm'

export const Login = () => {

  const [open, setOpen] = useState(false)

  // controls for modal
  const handleOpenModal = () => { setOpen(true) }
  const handleCloseModal = () => { setOpen(false) }

  return (
    <div className="flex h-screen">

      {/* image */}
      <div className="w-1/2 h-full">
        <img
          src="https://pub-e91187236c2541009a993bce3a8e29c8.r2.dev/0fc662bf-0fad-4f8b-9915-a805aef6d02b.jpeg"
          alt="Fondo login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Login lado derecho */}
      <div className="w-1/2 bg-secondary-200 flex flex-col justify-center items-center">
        <section className="w-3/4 flex flex-col gap-10">

          {/* logo y títle */}
          <div className="flex gap-4 justify-center items-center">
            <img src="ourbnb.svg" className="w-32 h-24" alt="logo empresarial" />
            <h1 className="font-bold text-primary-400 text-6xl">Ourbnb</h1>
          </div>

          <LoginForm />

          {/* create account */}
          <div className="flex flex-col gap-3">
            <hr />
            <div className="flex justify-center gap-2 text-lg">
              <span>¿No tienes una cuenta?</span>
              <button
                onClick={handleOpenModal}
                className="hover:underline underline-offset-4 hover:text-primary-300"
              >
                Crear una cuenta
              </button>
            </div>
          </div>
        </section>

        {/* register modal */}
        {open && (
          <Modal title="¡Crea una cuenta!" isOpen={open} closeModal={handleCloseModal}>
            <RegisterForm closeModal={handleCloseModal} />
          </Modal>
        )}
      </div>
    </div>
  )
}
