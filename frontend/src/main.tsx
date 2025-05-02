import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Login } from './pages/auth/Login'
import { store } from './store/store'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'

const rootElement = document.getElementById('root') as HTMLDivElement

createRoot(rootElement ?? (() => { throw new Error('Root element not found') })()).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster position='top-right' richColors/>
      <Login />
    </Provider>
  </StrictMode>,
)
