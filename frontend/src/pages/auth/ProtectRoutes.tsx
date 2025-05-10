import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoutes = () => {
  const { status } = useSelector(state => state.auth)

  if (status === 'not authenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
