import { useState } from 'react'
import bcrypt from 'bcryptjs'

export function useForm<T extends Record<string, unknown>> (initialForm: T) {

  const [form, setForm] = useState<T>(initialForm)
  const [showPassword, setShowPassword] = useState(false)

  // Get and set the input values
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  // handle hash for passwords
  const hashPassword = async (plainPassword: string) => {

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(plainPassword, salt)

    return hashedPassword
  }

  // allow to see the password field
  const handleToggleShow = () => {
    setShowPassword(!showPassword)
  }

  // set the form blank
  const handleReset = () => {
    setForm(initialForm)
  }


  return {
    ...form,
    form,
    showPassword,
    handleInputChange,
    hashPassword,
    handleToggleShow,
    handleReset
  }
}
