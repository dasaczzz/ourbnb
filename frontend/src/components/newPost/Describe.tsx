import { useState } from 'react'
import { Button } from '../primitives/Button'
import { FaHome, FaDoorClosed, FaDivide } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { updateDraftPost } from '../../store/slices/postSlice'

const options = [
  {
    title: 'Alojamiento entero',
    description: 'Los huéspedes disponen del alojamiento entero para ellos.',
    icon: <FaHome size={28} />,
  },
  {
    title: 'Una habitación',
    description: 'Los huéspedes tiene una habitación propia con acceso a espacios compartidos.',
    icon: <FaDoorClosed size={28} />,
  },
  {
    title: 'Habitación compartida',
    description: 'Los huéspedes duermen en una habitación que comparten.',
    icon: <FaDivide size={28} />,
  },
]

export const Describe = () => {
  const dispatch = useDispatch()
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = () => {
    if (selected) {
      dispatch(updateDraftPost({ type: selected }))
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">
        ¿De qué tipo de alojamiento dispondrán los huéspedes?
      </h2>

      <div className="space-y-4">
        {options.map((opt) => (
          <button
            key={opt.title}
            onClick={() => setSelected(opt.title)}
            className={`w-full flex items-center justify-between border rounded-lg p-4 shadow-sm text-left transition
              ${
                selected === opt.title
                  ? 'bg-primary-50 border-primary-500'
                  : 'bg-neutral-50 hover:bg-neutral-100 border-transparent'
              }`}
          >
            <div>
              <h3 className="text-md font-semibold">{opt.title}</h3>
              <p className="text-sm text-muted-foreground">{opt.description}</p>
            </div>
            <div className="text-primary-500">{opt.icon}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-end items-end w-1/3">
        <Button onClick={handleSelect} disabled={!selected} intent="primary">
          Seleccionar
        </Button>
      </div>
    </div>
  )
}

