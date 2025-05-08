import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getToken, removeToken } from '../../lib/cookies' // importa tus utilidades

const ProtectedRoutes = () => {
  const token = getToken()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/protected', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            removeToken()
            navigate('/admin', { replace: true })
          }
        } catch (error) {
          console.error('Token verification failed:', error)
          removeToken()
          navigate('/admin', { replace: true })
        }
      } else {
        navigate('/admin', { replace: true })
      }
    }

    verifyToken()
  }, [token, navigate])

  return token ? <Outlet /> : null
}

export default ProtectedRoutes
