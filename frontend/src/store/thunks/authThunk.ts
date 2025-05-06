import { Dispatch } from '@reduxjs/toolkit'
import { checkingCredentials } from '../slices/authSlice'
import { toast } from 'sonner'

export const startRegister = (form: Record<string, unknown>) => {
  return async(dispatch: Dispatch) => {
    dispatch(checkingCredentials())
    // call backend
    const result = await fetch('https://ourbnb-backend-tams5.ondigitalocean.app/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form),
      }
    )

    if(result.ok) {
      toast.success('Usuario registrado exitosamente')
    }

  }
}
