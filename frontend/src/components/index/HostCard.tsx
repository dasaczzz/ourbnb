import { PostState } from '../../store/slices/postSlice'

interface props {
  post: PostState
}

export const HostCard: React.FC<props> = ({post}) => {

  const priceToPrint = post.night_cost.toLocaleString('es-MX', {
  style: 'currency',
  currency: 'COP',
  })

  return (
    <article className="flex flex-col w-3xs rounded-full">
      <img src={post.images[0]} alt="Hospedaje" className='object-cover object-center size-64 aspect-square'/>
      <div className='flex flex-col p-2 items-start gap-3 bg-secondary-200 '>
        <span className='text-xl font-bold text-secondary-500'>{post.title}</span>
        <span className='text-lg text-secondary-500'><b className='font-bold'>{priceToPrint}</b> noche</span>
      </div>
    </article>
  )
}
