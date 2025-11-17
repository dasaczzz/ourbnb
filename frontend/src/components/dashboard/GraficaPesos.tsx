import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { DatoPeso } from '../../types/dashboard'

interface GraficaPesosProps {
  datos: DatoPeso[]
}

export const GraficaPesos: React.FC<GraficaPesosProps> = ({ datos }) => {
  const [mesSeleccionado, setMesSeleccionado] = useState<string>('todos')

  // Get unique months from the data
  const mesesUnicos = Array.from(new Set(datos.map(d => d.mes)))

  // Filter data based on selected month
  const datosFiltrados = mesSeleccionado === 'todos'
    ? datos
    : datos.filter(d => d.mes === mesSeleccionado)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Gráfica de Pesos</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="mes-select" className="text-sm font-medium text-gray-700">
            Mes:
          </label>
          <select
            id="mes-select"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
          >
            <option value="todos">Todos</option>
            {mesesUnicos.map((mes) => (
              <option key={mes} value={mes}>
                {mes}
              </option>
            ))}
          </select>
        </div>
      </div>

      {datosFiltrados.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={datosFiltrados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="mes"
              label={{ value: 'Mes', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="peso"
              stroke="#2c6d67"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Peso"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No hay datos disponibles para el mes seleccionado
          </p>
        </div>
      )}
    </div>
  )
}
