import type { Contenido } from '../../types/dashboard'

interface ListaContenidosProps {
  contenidos: Contenido[]
}

export const ListaContenidos: React.FC<ListaContenidosProps> = ({ contenidos }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Contenidos</h3>

      {contenidos.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {contenidos.map((contenido) => (
            <div
              key={contenido.id}
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{contenido.nombre}</h4>
                  <p className="text-sm text-gray-600">{contenido.categoria}</p>
                  {contenido.descripcion && (
                    <p className="text-xs text-gray-500 mt-1">{contenido.descripcion}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary-400">
                    {contenido.cantidad} unidades
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">
            No hay contenidos disponibles
          </p>
        </div>
      )}
    </div>
  )
}
