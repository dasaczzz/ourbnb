import { IconButton } from './IconButton'
import { FiGithub } from 'react-icons/fi'

export const Footer = () => {
  return (
    <footer className="bg-secondary-200">
      <div className='container flex flex-col gap-4'>
        <div className='flex justify-between '>
          <div className='flex flex-col items-start gap-4 w-72'>
            <div className='flex items-center gap-2.5'>
              <img src="ourbnb.svg" className='w-12 h-9' alt="logo empresarial" />
              <h3 className="font-bold text-secondary-500 text-2xl">Ourbnb</h3>
            </div>
            <p>Aplicación clon de Airbnb para la reserva de hospedajes en grupo</p>
          </div>
          <div className='flex justify-between items-start'>

            <div className='flex flex-col gap-4 items-start w-44'>
              <span className='text-lg font-bold'>Paginas</span>
              <ul className='flex flex-col gap-3 items-start justify-center'>
                <span className='cursor-pointer hover:underline'>Inicio</span>
                <span className='cursor-pointer hover:underline'>Tu casa en Ourbnb</span>
                <span className='cursor-pointer hover:underline'>Iniciar sesion</span>
              </ul>
            </div>

            <div className='flex flex-col gap-4 items-start w-44'>
              <span className='text-lg font-bold'>Creadores</span>
              <ul className='flex flex-col gap-3 items-start justify-center'>
                <span>Jose Daniel Arango Reina</span>
                <span>Daniel Sanchez Collazos</span>
                <span>Alejandro Solarte Gaitan</span>
              </ul>
            </div>
          </div>
        </div>
        <hr />
        <div className="flex justify-between items-center">
          <span className="font-light text-sm text-secondary-500">© 2025 Ourbnb Todos los derechos reservados</span>
            <a href="https://github.com/dasaczzz/ourbnb" target="_blank" rel="noopener noreferrer">
              <IconButton icon={<FiGithub size={16} />} color="bg-secondary-500" hoverColor='bg-secondary-400'/>
            </a>
        </div>
      </div>
    </footer>
  )
}
