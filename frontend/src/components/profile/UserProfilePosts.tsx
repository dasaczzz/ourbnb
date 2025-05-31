import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { Link, useNavigate } from 'react-router-dom'
import { startGetPostsByUser } from '../../store/thunks/postThunk'
import { fetchDeletePost } from '../../lib/api'
import { toast } from 'sonner'
import { LoadingSpinner } from '../primitives/LoadingSpinner'
import { Button } from '../primitives/Button'

export const UserProfilePosts = () => {
    const user = useSelector((state: any) => state.user)
    const userPosts = useSelector((state: any) => state.post.userPosts ?? [])
    const dispatch = useDispatch<AppDispatch>()
    const [loading, setLoading] = useState<Record<string, boolean>>({})
    const [confirming, setConfirming] = useState<Record<string, boolean>>({})
    const navigate = useNavigate()

    useEffect(() => {
        if (user.id) {
            dispatch(startGetPostsByUser(user.id))
        }
    }, [dispatch, user.id])

    const handleDelete = async (postId: string) => {
        if (!confirming[postId]) {
            setConfirming(prev => ({ ...prev, [postId]: true }))
            return
        }

        setLoading(prev => ({ ...prev, [postId]: true }))
        const success = await fetchDeletePost(postId)
        if (success) {
            toast.success('Publicación eliminada con éxito')
            dispatch(startGetPostsByUser(user.id))
        } else {
            toast.error('Error al eliminar la publicación')
        }
        setLoading(prev => ({ ...prev, [postId]: false }))
        setConfirming(prev => ({ ...prev, [postId]: false }))
    }

    return (
      <div className="mx-10 flex-[0.6] w-full sm:max-w-[1000px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold" data-testid="posts-title">Tus Publicaciones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 rounded-xl" data-testid="posts-grid">
            {userPosts.map((post: any) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg p-3 border border-gray-100 max-w-xs flex flex-row gap-4 transition duration-200 hover:bg-gray-100"
                data-testid={`post-card-${post.id}`}
              >
                <div className="flex flex-col w-full">
                  <Link to={`/post/${post.id}`} className="flex flex-col w-full">
                    <div className="overflow-hidden rounded-xl mb-3 w-full h-40 flex-shrink-0">
                      <img src={post.images?.[0]} alt={post.title} className="w-full h-full object-cover rounded-xl"/>
                    </div>
                    <div className="flex flex-col justify-between px-1">
                      <h2 className="font-semibold text-lg mb-1">{post.title}</h2>
                      <p className="text-gray-600 font-semibold mb-2">
                        {post.night_cost?.toLocaleString('es-MX', { style: 'currency', currency: 'COP', })} noche
                      </p>
                    </div>
                  </Link>
                  <div className="flex gap-2 px-1">
                    <Button intent="primary" onClick={() => navigate(`/edit-post/${post.id}`)} className="text-sm py-2" data-testid={`edit-post-${post.id}`}>Editar</Button>
                    <Button 
                      intent={confirming[post.id] ? "cancelFade" : "cancel"}
                      onClick={() => handleDelete(post.id)}
                      className="text-sm py-2"
                      disabled={loading[post.id]}
                      data-testid={`delete-post-${post.id}`}
                    >
                      {loading[post.id] ? <LoadingSpinner /> : confirming[post.id] ? 'Confirmar' : 'Eliminar'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!userPosts.length && (
            <div className='flex items-center'>
              <p className="text-sm text-gray-500 mr-1.5">Aquí verás tus publicaciones.</p>
              <button className="bg-gradient-to-r from-[#2c6d67] to-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:opacity-80 transition" onClick={() => navigate('/create-post')}>
                ¡Hagamos la primera!
              </button>
            </div>
          )}
        </div>
      </div>
    )
}

export default UserProfilePosts
