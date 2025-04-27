import { useForm } from '../../hooks/useForm'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { Button } from '../generics/Button'
import { Input } from '../generics/Input'

export const LoginForm = () => {

  const {email, password, form, handleInputChange, hashPassword, handleReset, showPassword, handleToggleShow, errors, validateForm} = useForm({email: '', password: ''})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // encrypt password and save in the form
    const passwordToSave = await hashPassword(password)
    const formToSubmit = {
      ...form,
      password: passwordToSave
    }

    console.log(formToSubmit)

    handleReset()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input text='Correo electrónico' error={errors.email} onChange={handleInputChange} placeholder='ejemplo@mail.com' name='email' value={email} type='text'/>
      <div className='flex justify-between items-center gap-3'>
        <Input type={showPassword ? 'text' : 'password'} text='Contraseña' error={errors.password} onChange={handleInputChange} placeholder='Tu contraseña' name='password' value={password}/>
        <button type='button' className='' onClick={handleToggleShow}>{showPassword ? <FaEyeSlash size={24}/> : <FaEye size={24}/>}</button>
      </div>
      <Button text='Entrar' type='submit'/>
    </form>
  )
}
