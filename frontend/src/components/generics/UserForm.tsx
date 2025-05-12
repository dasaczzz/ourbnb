import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { setUser } from '../../store/slices/userSlice'
import { fetchUpdateUser } from '../../lib/api'
import { toast } from 'sonner'
import { useForm } from '../../hooks/useForm'
import { Button } from '../primitives/Button'
import { Input } from '../primitives/Input'
import { useRef, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import React from 'react'

interface props {
  handleOpenModal: () => void
}

export const UserForm: React.FC<props> = ({handleOpenModal}) => {

  const state = useSelector(state => state.user)
  const dispatch = useDispatch<AppDispatch>()

  const {name, email, phone, password, form, showPassword, handleToggleShow, handleInputChange, handleReset, errors, validateForm} = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const formData = new FormData()
    if (name) formData.append('name', name)
    if (email) formData.append('email', email)
    if (phone) formData.append('phone', phone)
    if (password) formData.append('password', password)
    if (fileInputRef.current?.files?.[0]) {
      formData.append('profilepic', fileInputRef.current.files[0])
    }

    try {
      const updatedUser = await fetchUpdateUser(state.id, formData)
      dispatch(setUser(updatedUser))
      toast.success('Usuario actualizado correctamente')
      handleReset()
      setPreviewImage(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar usuario')
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <form onSubmit={handleSubmit} className='w-1/3 flex flex-col gap-4 items-center justify-center'>
      <div className="flex items-center relative">
        <img
          src={previewImage || state.profilepic}
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
          onChange={handleFileChange}
        />
      </div>
      <Input type='text' text='Nombre completo' error={errors.name} onChange={handleInputChange} placeholder={state.name} name='name' value={name} />
      <Input type='text' text='Correo electrónico' onChange={handleInputChange} error={errors.email} placeholder={state.email} name='email' value={email}/>
      <Input type='number' text='Telefono' onChange={handleInputChange} error={errors.phone} placeholder={state.phone} name='phone' value={phone}/>
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
