import { Route, Routes } from 'react-router-dom'
import { Index } from './pages/Index'
import { Login } from './pages/auth/Login'
import { Profile } from './pages/Profile'
import { ProtectedRoutes } from './pages/auth/ProtectRoutes'
import { Layout } from './pages/Layout'
import { NewPost } from './pages/NewPost'
import PostDetail from './pages/PostDetail'

export const Ourbnb = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />}/>

      <Route path='/' element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/' element={<Index />} />
          <Route path='/newPost' element={<NewPost />}/>
          <Route path='/post/:post_id' element={<PostDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}
