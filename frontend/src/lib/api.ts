export interface UserResponse {
  id: string
  name: string
  email: string
  phone: string
  profilepic: string
}

export const fetchLogin = async (credentials: { email: string; password: string }) => {
  const response = await fetch('http://localhost:4000/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.msg || 'Error de autenticación')
  }

  return true
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
