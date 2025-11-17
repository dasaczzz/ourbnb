// Types for Dashboard components

export interface Silo {
  id: string
  nombre: string
  capacidad: number
  pesoActual: number
  ubicacion: string
  tipo: string
}

export interface Contenido {
  id: string
  nombre: string
  categoria: string
  descripcion: string
  cantidad: number
  siloId?: string
}

export interface DatoPeso {
  mes: string
  peso: number
  fecha: Date
}

export interface Almacen {
  id: string
  nombre: string
  ubicacion: string
  capacidad: number
}
