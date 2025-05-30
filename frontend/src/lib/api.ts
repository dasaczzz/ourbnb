const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export interface UserResponse {
  id: string
  name: string
  email: string
  phone: string
  profilepic: string
}

export interface Post {
  id: string
  title: string
  description: string
  images: string[]
  location: {
    city: string
    country: string
    location: string
  }
  night_cost: number
  user_id: string
}

export interface BookingData {
  init_date: Date
  end_date: Date
  post_id: string
  service_cost: number
  total_cost: number
  users: string[]
}

export const fetchRegister = async (form: Record<string, unknown>) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
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
  const response = await fetch(`${API_BASE_URL}/login`, {
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
  const response = await fetch(`${API_BASE_URL}/logout`, {
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
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'GET',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('No se pudo obtener la información del usuario')
  }

  const data = await response.json()
  return data
}

export const fetchUserById = async (user_id: string): Promise<UserResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/${user_id}`, {
    method: 'GET',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('No se pudo obtener la información del usuario por ID')
  }

  const data = await response.json()
  return data
}

export const fetchDeleteUser = async (id: string) => {
   try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Error al eliminar el usuario')
    }

    return true
  } catch (error) {
    if (error instanceof Error) return false
  }
}

export const fetchUpdateUser = async (id: string, data: FormData | Record<string, unknown>) => {
  const isFormData = data instanceof FormData
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? data : JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.error || 'Error al actualizar el usuario')
  }

  const updatedUser = await response.json()
  return updatedUser
}

export const fetchPosts = async (filters?: { city?: string; country?: string; minPrice?: number; maxPrice?: number }) => {
  try {
    let url = `${API_BASE_URL}/posts`
    const params = new URLSearchParams()

    if (filters) {
      if (filters.city) params.append('city', filters.city)
      if (filters.country) params.append('country', filters.country)
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
    }

    if (Array.from(params).length > 0) {
      url += `?${params.toString()}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('No se pudo obtener la información del usuario')
    }
    const data = await response.json()
    return data
  }
  catch (error) {
    if (error instanceof Error) return false
  }
}

export const fetchPost = async (post_id: string): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${post_id}`)
  if (!response.ok) {
    throw new Error('No se pudo obtener la información del post')
  }
  const data = await response.json()
  return data
}

export const createBooking = async (bookingData: BookingData) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al crear la reservación')
  }

  const data = await response.json()
  return data
}

export const fetchBookingsByUser = async (user_id: string) => {
  const response = await fetch(`${API_BASE_URL}/bookingsByUser/${user_id}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al obtener las reservaciones del usuario')
  }

  const data = await response.json()
  return data
}

export const fetchVerifyCookie = async() => {
  const response = await fetch(`${API_BASE_URL}/verify`, {
    method: 'GET',
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('No autenticado')
  }
  const data = await response.json()
  return data
}

export const fetchDeleteBooking = async (id: string) => {
   try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Error al eliminar el reserva')
    }

    return true
  } catch (error) {
    if (error instanceof Error) return false
  }
}

export const fetchPostsByUser = async (user_id: string) => {
  const response = await fetch(`${API_BASE_URL}/postsByUser/${user_id}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al obtener las publicaciones del usuario')
  }

  const data = await response.json()
  return data
}

export const fetchPostsBySearch = async (query: string) => {
 const response = await fetch(`${API_BASE_URL}/posts/search?query=${encodeURIComponent(query)}`, {
   method: 'GET',
  })

 if (!response.ok) {
  const errorData = await response.json()
    throw new Error(errorData.message || 'Error al buscar las publicaciones')
  }

  const data = await response.json()
  return data
}

export const fetchBookingsUsersValidate = async (huespedes: string[]) => {
  const response = await fetch(`${API_BASE_URL}/bookingsUsersValidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(huespedes)
  })

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}

export const fetchReviewsByPostId = async (post_id: string) => {
  const response = await fetch(`${API_BASE_URL}/reviewsByPost/${post_id}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al obtener las reviews del post')
  }

  const data = await response.json()
  return data
}

export const fetchCreateReview = async (reviewData: any) => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewData)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al crear la reseña')
  }

  const data = await response.json()
  return data
}

export const fetchDeleteReviewById = async (id: string) => {
  try {
   const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
     method: 'DELETE',
     credentials: 'include',
   })

   if (!response.ok) {
     throw new Error('Error al eliminar la reseña')
   }

   return true
 } catch (error) {
   if (error instanceof Error) return false
 }
}

export const fetchDeletePost = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Error al eliminar la publicación')
    }

    return true
  } catch (error) {
    if (error instanceof Error) return false
  }
}

export const fetchUpdatePost = async (id: string, data: FormData | Record<string, unknown>) => {
  const isFormData = data instanceof FormData
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? data : JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.error || 'Error al actualizar la publicación')
  }

  const updatedPost = await response.json()
  return updatedPost
}
