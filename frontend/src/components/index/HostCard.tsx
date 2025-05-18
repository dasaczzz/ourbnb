import { Link } from 'react-router-dom'
import { PostState } from '../../store/slices/postSlice'

interface props {
  post: PostState
}

export const HostCard: React.FC<props> = ({post}) => {

  const priceToPrint = (post.night_cost ?? 0).toLocaleString('es-CO', {
  style: 'currency',
  currency: 'COP',
  })

  return (
    <div className="flex flex-col w-3xs rounded-xl">
      <Link to={`/post/${post.id}`} key={post.id}>
      <div className='flex flex-col items-start gap-3 bg-secondary-200 rounded-2xl shadow-md mb-3'>
        <img src={post.images && post.images.length > 0 ? post.images[0] : '/placeholder.jpg'} alt="Hospedaje" className='object-cover object-center size-64 aspect-square rounded-t-2xl'/>
          <div className='flex flex-col mx-2 gap-2'>
            <span className='text-xl font-bold text-secondary-500'>{post.title}</span>
            <span className='text-lg text-secondary-500 mb-3'><b className='font-bold'>{priceToPrint}</b> noche</span>
          </div>
        </div>
      </Link>

    </div>
  )
}
