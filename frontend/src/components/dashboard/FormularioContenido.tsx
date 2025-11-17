import { useState } from 'react'
import { Button } from '../primitives/Button'
import { Input } from '../primitives/Input'
import { toast } from 'sonner'
import type { Contenido } from '../../types/dashboard'

interface FormularioContenidoProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (newContenido: Omit<Contenido, 'id'>) => void
  onCancel: () => void
}

export const FormularioContenido: React.FC<FormularioContenidoProps> = ({ onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }
    if (!categoria.trim()) {
      newErrors.categoria = 'La categoría es requerida'
    }
    if (!cantidad || parseInt(cantidad) <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Por favor complete los campos requeridos')
      return
    }

    onSubmit({
      nombre,
      categoria,
      descripcion,
      cantidad: parseInt(cantidad)
    })

    // Reset form
    setNombre('')
    setCategoria('')
    setDescripcion('')
    setCantidad('')
    setErrors({})
    toast.success('Contenido agregado exitosamente')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Agregar Nuevo Contenido</h2>

      <Input
        type="text"
        text="Nombre"
        name="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ingrese el nombre del contenido"
        error={errors.nombre}
      />

      <Input
        type="text"
        text="Categoría"
        name="categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        placeholder="Ingrese la categoría"
        error={errors.categoria}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
          Descripción (opcional)
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ingrese una descripción"
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 min-h-20"
        />
      </div>

      <Input
        type="number"
        text="Cantidad"
        name="cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        placeholder="Ingrese la cantidad"
        error={errors.cantidad}
      />

      <div className="flex gap-4 justify-end pt-4">
        <Button
          type="button"
          intent="cancel"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          intent="primary"
        >
          Agregar Contenido
        </Button>
      </div>
    </form>
  )
}
