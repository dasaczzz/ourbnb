import { checkingCredentials, login, logout } from '../slices/authSlice'
import { toast } from 'sonner'
import { AppDispatch } from '../store'
import { fetchLogin, fetchUserInfo } from '../../lib/api'
import { setUser } from '../slices/userSlice'

export const startRegister = (form: Record<string, unknown>) => {
  return async(dispatch: AppDispatch) => {
    dispatch(checkingCredentials())
    try {
      // call backend
      const result = await fetch('http://localhost:4000/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        }
      )
      if(!result.ok) {
        const error = await result.text()
        dispatch(logout({errorMessage: error}))
        toast.error(error)
        return
      }

      await dispatch(startLogin({
        email: form.email,
        login_password: form.password // asegúrate que coincida
      }))

      toast.success('Usuario registrado exitosamente')
    } catch (error) {
      if (error instanceof Error) toast.error('No se pudo registrar el usuario. Intentalo de nuevo')
    }

  }
}

export const startLogin = (form: Record<string, unknown>) => {
  return async(dispatch: AppDispatch) => {
    dispatch(checkingCredentials())

    try {
      await fetchLogin({
        email: String(form.email),
        password: String(form.login_password)
      })
      dispatch(login())

      const userData = await fetchUserInfo()
      dispatch(setUser(userData))
    } catch (error) {
      if(error instanceof Error) dispatch(logout({errorMessage: error.message}))
    }
  }
}
