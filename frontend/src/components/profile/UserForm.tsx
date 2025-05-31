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

  const state = useSelector((state: any) => state.user)
  const dispatch = useDispatch<AppDispatch>()

  const {name, email, phone, password, showPassword, handleToggleShow, handleInputChange, handleReset, errors, validateForm} = useForm({
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

    const updateData: any = {}
    
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (phone) updateData.phone = phone
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres')
        return
      }
      updateData.password = password
      toast.success('Tu contraseña ha sido actualizada. Por favor, recuerda tu nueva contraseña.')
    }

    if (fileInputRef.current?.files?.[0]) {
      const imageFormData = new FormData()
      imageFormData.append('profilepic', fileInputRef.current.files[0])
      try {
        const updatedUserWithImage = await fetchUpdateUser(state.id, imageFormData)
        dispatch(setUser(updatedUserWithImage))
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error al actualizar la imagen')
        return
      }
    }
    if (Object.keys(updateData).length > 0) {
      try {
        const updatedUser = await fetchUpdateUser(state.id, updateData)
        dispatch(setUser(updatedUser))
        toast.success('Usuario actualizado correctamente')
        handleReset()
        setPreviewImage(null)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error al actualizar usuario')
      }
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <form onSubmit={handleSubmit} className='flex items-center justify-center h-full py-4 flex-col w-1/3  gap-4' data-testid="user-form">
      <h2 className='font-bold text-3xl' data-testid="profile-title">Tu perfil</h2>

      <div className="flex items-center relative">
        <img
          src={previewImage || state.profilepic}
          alt="Foto de perfil"
          onClick={handleImageClick}
          className="w-24 h-24 object-cover rounded-full outline-2 outline-secondary-400 cursor-pointer hover:bg-secondary-500/25 transition"
          data-testid="profile-image"
        />
        <div
          className="absolute -bottom-2 -right-2 bg-white rounded-full outline-secondary-400 p-1 shadow-md cursor-pointer hover:bg-gray-100 transition"
          onClick={handleImageClick}
          data-testid="edit-image-button"
        >
          <FaPen className="w-6 h-6 text-secondary-400" />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          data-testid="file-input"
        />
      </div>
      <Input type='text' text='Nombre completo' error={errors.name} onChange={handleInputChange} placeholder={state.name} name='name' value={name} data-testid="name-input" />
      <Input type='text' text='Correo electrónico' onChange={handleInputChange} error={errors.email} placeholder={state.email} name='email' value={email} data-testid="email-input"/>
      <Input type='number' text='Telefono' onChange={handleInputChange} error={errors.phone} placeholder={state.phone} name='phone' value={phone} data-testid="phone-input"/>
      <div className='flex justify-between gap-3 items-center w-full'>
        <Input 
          type={showPassword ? 'text' : 'password'} 
          text='Nueva contraseña (opcional)' 
          error={errors.password} 
          onChange={handleInputChange} 
          placeholder='Deja en blanco para mantener la actual' 
          name='password' 
          value={password} 
          data-testid="password-input"
        />
        <button type='button' onClick={handleToggleShow} data-testid="toggle-password-visibility">{showPassword ? <FaEyeSlash size={24}/> : <FaEye size={24}/>}</button>
      </div>
      <hr />
      <div className='flex justify-between w-full gap-4'>
        <Button intent='cancel' onClick={handleOpenModal} type='button' data-testid="delete-account-button">Eliminar cuenta</Button>
        <Button intent='primary' type='submit' data-testid="update-profile-button">Actualizar información</Button>
      </div>
    </form>
  )
}
