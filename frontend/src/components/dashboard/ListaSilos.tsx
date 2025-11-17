import type { Silo } from '../../types/dashboard'

interface ListaSilosProps {
  silos: Silo[]
}

export const ListaSilos: React.FC<ListaSilosProps> = ({ silos }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Lista de Silos</h2>

      {silos.length > 0 ? (
        <div className="grid gap-4">
          {silos.map((silo) => (
            <div
              key={silo.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{silo.nombre}</h3>
                  <p className="text-sm text-gray-600 mt-1">Ubicación: {silo.ubicacion}</p>
                  <p className="text-sm text-gray-600">Tipo: {silo.tipo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Capacidad: {silo.capacidad} kg</p>
                  <p className="text-sm font-medium text-primary-400">
                    Peso actual: {silo.pesoActual} kg
                  </p>
                  <div className="mt-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-400 h-2 rounded-full"
                        style={{ width: `${Math.min((silo.pesoActual / silo.capacidad) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((silo.pesoActual / silo.capacidad) * 100)}% lleno
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No hay silos disponibles en este momento
          </p>
        </div>
      )}
    </div>
  )
}
