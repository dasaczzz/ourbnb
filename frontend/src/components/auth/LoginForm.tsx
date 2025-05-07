import { useForm } from '../../hooks/useForm'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { Button } from '../primitives/Button'
import { Input } from '../primitives/Input'
import { AppDispatch } from '../../store/store'
import { useDispatch } from 'react-redux'
import { startLogin } from '../../store/thunks/authThunk'

export const LoginForm = () => {

  const dispatch = useDispatch<AppDispatch>()
  const {email, login_password, form, handleInputChange, handleReset, showPassword, handleToggleShow, errors, validateForm} = useForm({email: '', login_password: ''})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    dispatch(startLogin(form))
    handleReset()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input text='Correo electrónico' error={errors.email} onChange={handleInputChange} placeholder='ejemplo@mail.com' name='email' value={email} type='text'/>
      <div className='flex justify-between items-center gap-3'>
        <Input type={showPassword ? 'text' : 'password'} text='Contraseña' error={errors.login_password} onChange={handleInputChange} placeholder='Tu contraseña' name='login_password' value={login_password}/>
        <button type='button' className='' onClick={handleToggleShow}>{showPassword ? <FaEyeSlash size={24}/> : <FaEye size={24}/>}</button>
      </div>
      <Button intent='primary' type='submit'>Entrar</Button>
    </form>
  )
}
