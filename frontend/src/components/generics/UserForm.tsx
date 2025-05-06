import { useForm } from '../../hooks/useForm'
import { Button } from '../primitives/Button'
import { Input } from '../primitives/Input'
import { useRef } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'


interface props {
  handleOpenModal: () => void
}

export const UserForm: React.FC<props> = ({handleOpenModal}) => {

  const {name, email, phone, password, form, showPassword, handleToggleShow, handleInputChange, handleReset, errors, validateForm} = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    handleReset()
    return form
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <form onSubmit={handleSubmit} className='w-1/3 flex flex-col gap-4 items-center justify-center'>
      <div className="flex items-center relative">
        <img
          alt="Foto de perfil"
          onClick={handleImageClick}
          className="w-24 h-24 object-cover rounded-full outline-2 outline-secondary-400 cursor-pointer hover:bg-secondary-500/25 transition"
        />
        <div
        className="absolute -bottom-2 -right-2 bg-white rounded-full outline-secondary-400 p-1 shadow-md cursor-pointer hover:bg-gray-100 transition"
        onClick={handleImageClick}
      >
        <FaPen className="w-6 h-6 text-secondary-400" />
      </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
        />
      </div>
      <Input type='text' text='Nombre completo' error={errors.name} onChange={handleInputChange} placeholder='Juan Perez' name='name' value={name} />
      <Input type='text' text='Correo electrónico' onChange={handleInputChange} error={errors.email} placeholder='ejemplo@mail.com' name='email' value={email}/>
      <Input type='number' text='Telefono' onChange={handleInputChange} error={errors.phone} placeholder='300 1234567' name='phone' value={phone}/>
      <div className='flex justify-between gap-3 items-center w-full'>
        <Input type={showPassword ? 'text' : 'password'} text='Contraseña' error={errors.password} onChange={handleInputChange} placeholder='Tu contraseña' name='password' value={password}/>
        <button type='button' onClick={handleToggleShow}>{showPassword ? <FaEyeSlash size={24}/> : <FaEye size={24}/>}</button>
      </div>
      <hr />
      <div className='flex justify-between w-full gap-4'>
        <Button intent='secondary' onClick={handleOpenModal} type='button'>Eliminar cuenta</Button>
        <Button intent='primary' type='submit'>Actualizar información</Button>
      </div>
    </form>
  )
}
