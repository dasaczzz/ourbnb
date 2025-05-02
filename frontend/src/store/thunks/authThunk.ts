import { Dispatch } from '@reduxjs/toolkit'
import { checkingCredentials } from '../slices/authSlice'

export const startRegister = (form: Record<string, unknown>) => {
  return async(dispatch: Dispatch) => {
    dispatch(checkingCredentials())
    // call backend
    const result = await fetch('http://localhost:4000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form),
      }
    )
    return result.json()
  }
}
