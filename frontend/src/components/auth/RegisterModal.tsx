import { useForm } from '../../hooks/useForm'
import { FaXmark, FaEye, FaEyeSlash } from 'react-icons/fa6'
import { Button } from '../generics/Button'
import { Input } from '../generics/Input'
import { startRegister } from '../../store/thunks/authThunk'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store/store'

interface props {
  isOpen: boolean,
  closeModal: () => void
}

export const RegisterModal: React.FC<props> = ({isOpen, closeModal}) => {

  const dispatch = useDispatch<AppDispatch>()

  const {name, email, phone, password, confirm, form, showPassword, handleToggleShow, handleInputChange, hashPassword, handleReset, errors, validateForm} = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // validations
    if (!validateForm()) return

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const {confirm, ...inputs} = form

    // encrypt password and save in the form
    const passwordToSave = await hashPassword(password)
    const formToSubmit = {
      ...inputs,
      password: passwordToSave
    }

    dispatch(startRegister(formToSubmit))
    closeModal()
    handleReset()
  }

  return (
    <dialog className={`${isOpen ? 'flex' : 'hidden'} h-full w-full rounded bg-secondary-100 shadow bg-secondary-500/50 justify-center items-center`}>
      <div className='w-1/3 bg-secondary-300 rounded-md px-6 pt-6 pb-12 flex flex-col items-center gap-8'>
        <div className='flex justify-between w-full'>
          <h4 className='text-pretty text-4xl font-bold'>Crea una cuenta!</h4>
          <button className='text-primary-400 hover:text-primary-300' onClick={() => {handleReset(); closeModal()}}>
            <FaXmark size={36}/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className='w-2/3 flex flex-col gap-4'>
          <Input type='text' text='Nombre completo' error={errors.name} onChange={handleInputChange} placeholder='Juan Perez' name='name' value={name} />
          <Input type='text' text='Correo electrónico' onChange={handleInputChange} error={errors.email} placeholder='ejemplo@mail.com' name='email' value={email}/>
          <Input type='number' text='Telefono' onChange={handleInputChange} error={errors.phone} placeholder='300 1234567' name='phone' value={phone}/>
          <div className='flex justify-between gap-3 items-center'>
            <Input type={showPassword ? 'text' : 'password'} text='Contraseña' error={errors.password} onChange={handleInputChange} placeholder='Tu contraseña' name='password' value={password}/>
            <button type='button' onClick={handleToggleShow}>{showPassword ? <FaEyeSlash size={24}/> : <FaEye size={24}/>}</button>
          </div>
          <Input type='password' text='Confirma tu contraseña' error={errors.confirm} onChange={handleInputChange} placeholder='Tu contraseña otra vez' name='confirm' value={confirm}/>
          <Button text='Registrarme' type='submit'/>
        </form>
      </div>
    </dialog>
  )
}
