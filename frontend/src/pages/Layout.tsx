import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/generics/Navbar'
import { Footer } from '../components/generics/Footer'

export const Layout = () => {
  return (
    <div>
      <Navbar />

      <main className='min-h-[calc(100dvh-260px)]'>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
