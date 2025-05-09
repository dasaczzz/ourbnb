import { Route, Routes } from 'react-router-dom'
import { Index } from './pages/Index'
import { Login } from './pages/auth/Login'
import { Profile } from './pages/Profile'
import ProtectedRoutes from './pages/auth/ProtectRoutes'

export const Ourbnb = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />}/>
      <Route path='/' element={<Index />} />

      <Route element={<ProtectedRoutes />}>
        <Route path='/profile' element={<Profile />}/>

      </Route>
    </Routes>
  )
}
