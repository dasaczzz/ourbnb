import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/generics/Navbar'
import { Footer } from '../components/generics/Footer'
import { ChatModal } from '../components/chat/ChatModal'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

export const Layout = () => {
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const isAuthenticated = authStatus === 'authenticated';

  return (
    <div>
      <Navbar />

      <main className='min-h-[calc(100dvh-260px)]'>
        <Outlet />
      </main>

      <Footer />
      
      {isAuthenticated && <ChatModal />}
    </div>
  )
}
