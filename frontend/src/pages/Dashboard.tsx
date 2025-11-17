import { useState } from 'react'
import { GraficaPesos } from '../components/dashboard/GraficaPesos'
import { ListaSilos } from '../components/dashboard/ListaSilos'
import { Sidebar } from '../components/dashboard/Sidebar'
import type { Silo, Contenido, DatoPeso } from '../types/dashboard'

// Sample data for demonstration
const datosPesoIniciales: DatoPeso[] = [
  { mes: 'Enero', peso: 1200, fecha: new Date('2024-01-15') },
  { mes: 'Febrero', peso: 1350, fecha: new Date('2024-02-15') },
  { mes: 'Marzo', peso: 1180, fecha: new Date('2024-03-15') },
  { mes: 'Abril', peso: 1420, fecha: new Date('2024-04-15') },
  { mes: 'Mayo', peso: 1560, fecha: new Date('2024-05-15') },
  { mes: 'Junio', peso: 1490, fecha: new Date('2024-06-15') },
  { mes: 'Julio', peso: 1630, fecha: new Date('2024-07-15') },
  { mes: 'Agosto', peso: 1580, fecha: new Date('2024-08-15') },
  { mes: 'Septiembre', peso: 1720, fecha: new Date('2024-09-15') },
  { mes: 'Octubre', peso: 1680, fecha: new Date('2024-10-15') },
  { mes: 'Noviembre', peso: 1800, fecha: new Date('2024-11-15') },
  { mes: 'Diciembre', peso: 1750, fecha: new Date('2024-12-15') }
]

const silosIniciales: Silo[] = [
  {
    id: '1',
    nombre: 'Silo Principal A',
    capacidad: 5000,
    pesoActual: 3200,
    ubicacion: 'Zona Norte',
    tipo: 'Granos'
  },
  {
    id: '2',
    nombre: 'Silo Secundario B',
    capacidad: 3000,
    pesoActual: 2100,
    ubicacion: 'Zona Sur',
    tipo: 'Cereales'
  },
  {
    id: '3',
    nombre: 'Silo de Reserva C',
    capacidad: 4000,
    pesoActual: 1500,
    ubicacion: 'Zona Este',
    tipo: 'Semillas'
  }
]

const contenidosIniciales: Contenido[] = [
  {
    id: '1',
    nombre: 'Trigo',
    categoria: 'Granos',
    descripcion: 'Trigo de alta calidad',
    cantidad: 500,
    siloId: '1'
  },
  {
    id: '2',
    nombre: 'Maíz',
    categoria: 'Cereales',
    descripcion: 'Maíz amarillo',
    cantidad: 350,
    siloId: '2'
  }
]

export const Dashboard = () => {
  const [contenidos, setContenidos] = useState<Contenido[]>(contenidosIniciales)

  const handleAgregarContenido = (nuevoContenido: Omit<Contenido, 'id'>) => {
    const contenido: Contenido = {
      ...nuevoContenido,
      id: Date.now().toString()
    }
    setContenidos([...contenidos, contenido])
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Dashboard de Gestión</h1>

          {/* GraficaPesos - now with month selection */}
          <GraficaPesos datos={datosPesoIniciales} />

          {/* ListaSilos - with empty state message */}
          <ListaSilos silos={silosIniciales} />
        </div>
      </div>

      {/* Sidebar with content list and add button */}
      <Sidebar
        contenidos={contenidos}
        onAgregarContenido={handleAgregarContenido}
      />
    </div>
  )
}
