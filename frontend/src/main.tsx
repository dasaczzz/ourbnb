import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from './store/store'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { BrowserRouter } from 'react-router-dom'
import { Ourbnb } from './Ourbnb'

const rootElement = document.getElementById('root') as HTMLDivElement

createRoot(rootElement ?? (() => { throw new Error('Root element not found') })()).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position='top-right' richColors/>
        <Ourbnb />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
