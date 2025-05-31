import { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { Input } from '../primitives/Input'
import { toast } from 'sonner'
import { FaRegImage } from 'react-icons/fa6'

export interface HighlightHandle {
  getData: () => { title: string; description: string; images: File[] };
  isValid: boolean;
}

interface Props {
  onValidationChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Highlight = forwardRef<HighlightHandle, Props>(({ onValidationChange }, ref) => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentIsValid = title.trim().length > 0 && description.trim().length > 0 && selectedFiles.length >= 1

  useEffect(() => {
    onValidationChange(currentIsValid)
  }, [currentIsValid, onValidationChange])

  useImperativeHandle(ref, () => ({
    getData: () => ({
      title,
      description,
      images: selectedFiles
    }),
    isValid: currentIsValid
  }))

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((): void => {
    setIsDragOver(false)
  }, [])

  const handleFiles = useCallback((files: File[]): void => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0 && files.length > 0) {
      toast.error('Solo puedes subir archivos de imagen.')
      return
    }
    if (imageFiles.length === 0 && files.length === 0) {
        return
    }

    const newFiles = [...selectedFiles, ...imageFiles]
    setSelectedFiles(newFiles)

    if (newFiles.length < 1) {
      toast(`Necesitas ${1 - newFiles.length} foto más.`);
    } else {
      toast.success(`Tienes ${newFiles.length} foto(s). ¡Listo para continuar!`)
    }
  }, [selectedFiles])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    setIsDragOver(false)

    const files = Array.from(event.dataTransfer.files)
    handleFiles(files)
  }, [handleFiles])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files ? Array.from(event.target.files) : []
    handleFiles(files)
  }

  const handleRemoveFile = (fileName: string): void => {
    const updatedFiles = selectedFiles.filter(file => file.name !== fileName)
    setSelectedFiles(updatedFiles)
    toast.success(`Foto "${fileName}" eliminada.`)
  }

  const triggerFileInput = (): void => {
    fileInputRef.current?.click()
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  return (
    <div className='flex flex-col gap-4 w-1/2 '>
      <h2 className='text-2xl font-bold'>Ponle título a tu espacio</h2>
      <Input
        text='Los títulos cortos funcionan mejor. Puedes modificarlo mas adelante.'
        type="text"
        placeholder="Título de tu espacio"
        value={title}
        onChange={handleTitleChange}
      />
      <hr className='py-2'/>
      <h2 className='text-2xl font-bold'>Ponle una descripción a tu espacio</h2>
      <Input
        text='Comparte lo que hace tu espacio especial.'
        type="text"
        placeholder="Descripción de tu espacio"
        value={description}
        onChange={handleDescriptionChange}
      />
      <hr className='py-2'/>
      <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Agrega algunas fotos</h2>
      <p className="text-sm text-muted-foreground">
        Necesitarás 1 foto para mostrar tu espacio. Después podrás agregar más o modificarlas.
      </p>

      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
          ${isDragOver ? 'border-primary-500 bg-secondary-100' : 'border-secondary-400 bg-secondary-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <FaRegImage size={64} className="text-primary-500" />
          <p className="text-xl font-semibold text-gray-700">Arrastra tus fotos aquí</p>
          <p className="text-sm text-muted-foreground">Elije por lo menos 1 foto</p>

          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={triggerFileInput}
            className="text-primary-500 hover:underline cursor-pointer text-lg font-medium"
          >
            Sube fotos desde tu dispositivo
          </button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Fotos seleccionadas ({selectedFiles.length}):</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <li key={index} className="relative group overflow-hidden rounded-lg shadow-md">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs text-center p-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-24px)]">
                      {file.name}
                  </span>
                  <button
                    onClick={() => handleRemoveFile(file.name)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    title="Eliminar foto"
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedFiles.length < 1 && selectedFiles.length > 0 && (
        <p className="text-red-500 text-center font-medium">
          ¡Atención! Necesitas al menos 1 foto para continuar. Actualmente tienes {selectedFiles.length}.
        </p>
      )}
       {selectedFiles.length === 0 && (
        <p className="text-muted-foreground text-center">
            Aún no has agregado ninguna foto.
        </p>
       )}
    </div>
    </div>
  )
})

// Asegúrate de que el nombre de visualización para React DevTools sea correcto
Highlight.displayName = 'Highlight'
