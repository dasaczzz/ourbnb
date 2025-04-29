import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Login } from './pages/auth/Login'

const rootElement = document.getElementById('root') as HTMLDivElement

createRoot(rootElement ?? (() => { throw new Error('Root element not found') })()).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)
