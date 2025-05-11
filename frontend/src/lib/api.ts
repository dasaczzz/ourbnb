export interface UserResponse {
  id: string
  name: string
  email: string
  phone: string
  profilepic: string
}

export const fetchRegister = async (form: Record<string, unknown>) => {
  const response = await fetch('http://localhost:4000/users', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Error al registrar el usuario')
  }

  const data = await response.json()
  return data
}

export const fetchLogin = async (credentials: { email: string; password: string }) => {
  const response = await fetch('http://localhost:4000/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })

  if (response.status === 401) {
    throw new Error('El usuario o la contraseña son incorrectas. Intentalo de nuevo')
  }

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.msg || 'Error de autenticación')
  }

  return true
}

export const fetchLogout = async () => {
  const response = await fetch('http://localhost:4000/logout', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.msg || 'No se pudo cerrar la sesion')
  }
}

export const fetchUserInfo = async (): Promise<UserResponse> => {
  const response = await fetch('http://localhost:4000/user', {
    method: 'GET',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('No se pudo obtener la información del usuario')
  }

  const data = await response.json()
  return data
}
