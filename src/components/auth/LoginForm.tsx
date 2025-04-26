import { useForm } from '../../hooks/useForm'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { Button } from '../generics/Button'
import { Input } from '../generics/Input'

export const LoginForm = () => {

  const {email, password, form, handleInputChange, hashPassword, handleReset, showPassword, handleToggleShow,} = useForm({email: '', password: ''})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
    <form onSubmit={handleSubmit} className="flex flex-col p-6">
      <Input text='Correo electrónico' onChange={handleInputChange} placeholder='ejemplo@mail.com' name='email' value={email} type='email' />
      <div className='flex gap-2'>
        <Input text='Contraseña' onChange={handleInputChange} placeholder='Tu contraseña' name='password' value={password} type='password' />
        <button type='button' className='mb-5' onClick={handleToggleShow}>{showPassword ? <FaEyeSlash size={24}/> : <FaEye size={24}/>}</button>
      </div>
      <Button text='Entrar' type='submit'/>
    </form>
  )
}
