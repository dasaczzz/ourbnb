import { Route, Routes } from 'react-router-dom'
import { Index } from './pages/Index'
import { Login } from './pages/auth/Login'
import { Profile } from './pages/Profile'
import { ProtectedRoutes } from './pages/auth/ProtectRoutes'
import { Layout } from './pages/Layout'
import { NewPost } from './pages/NewPost'
import PostDetail from './pages/PostDetail'
import BookingConfirmation from './pages/BookingConfirmation'
import { AnimatePresence } from 'framer-motion'
import { AnimatedPage } from './components/animation/AnimatedPage'
import { useEffect } from 'react'
import { AppDispatch } from './store/store'
import { useDispatch } from 'react-redux'
import { checkAuthStatus } from './store/thunks/authThunk'

export const Ourbnb = () => {

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  return (
    <AnimatePresence mode="wait">
    <Routes>
      <Route path='/login' element={<Login />}/>

      <Route path='/' element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path='/profile' element={<AnimatedPage><Profile /></AnimatedPage>}/>
          <Route path='/' element={<AnimatedPage><Index /></AnimatedPage>} />
          <Route path='/newPost' element={<AnimatedPage><NewPost /></AnimatedPage>}/>
          <Route path='/post/:post_id' element={<AnimatedPage><PostDetail /></AnimatedPage>} />
          <Route path="/bookingConfirmation/:post_id" element={<AnimatedPage><BookingConfirmation /></AnimatedPage>} />

        </Route>
      </Route>
    </Routes>
    </AnimatePresence>
  )
}
