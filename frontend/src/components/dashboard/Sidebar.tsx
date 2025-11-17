import { useState } from 'react'
import { Button } from '../primitives/Button'
import { Modal } from '../primitives/Modal'
import { ListaContenidos } from './ListaContenidos'
import { FormularioContenido } from './FormularioContenido'
import type { Contenido } from '../../types/dashboard'

interface SidebarProps {
  contenidos: Contenido[]
  // eslint-disable-next-line no-unused-vars
  onAgregarContenido: (nuevoContenido: Omit<Contenido, 'id'>) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ contenidos, onAgregarContenido }) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const handleAgregarContenido = (contenido: Omit<Contenido, 'id'>) => {
    onAgregarContenido(contenido)
    setMostrarFormulario(false)
  }

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Panel</h2>
      </div>

      <Button
        intent="primary"
        onClick={() => setMostrarFormulario(true)}
      >
        + Agregar Contenido
      </Button>

      <ListaContenidos contenidos={contenidos} />

      <Modal
        title="Nuevo Contenido"
        isOpen={mostrarFormulario}
        closeModal={() => setMostrarFormulario(false)}
      >
        <FormularioContenido
          onSubmit={handleAgregarContenido}
          onCancel={() => setMostrarFormulario(false)}
        />
      </Modal>
    </div>
  )
}
