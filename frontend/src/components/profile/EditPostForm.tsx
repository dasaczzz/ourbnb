import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { fetchUpdatePost, fetchPost } from '../../lib/api'
import { toast } from 'sonner'
import { startGetPostsByUser } from '../../store/thunks/postThunk'
import { useParams, useNavigate } from 'react-router-dom'

export const EditPostForm = () => {
    const { post_id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: any) => state.user)
    const [post, setPost] = useState<any>(null)
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        night_cost: 0
    })

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await fetchPost(post_id!)
                setPost(postData)
                setEditForm({
                    title: postData.title,
                    description: postData.description,
                    night_cost: postData.night_cost
                })
            } catch (error) {
                toast.error('Error al cargar la publicación')
                navigate('/profile')
            }
        }
        loadPost()
    }, [post_id, navigate])

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await fetchUpdatePost(post_id!, editForm)
            toast.success('Publicación actualizada con éxito')
            dispatch(startGetPostsByUser(user.id))
            navigate('/profile')
        } catch (error) {
            toast.error('Error al actualizar la publicación')
        }
    }

    if (!post) {
        return <div>Cargando...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Editar Publicación</h3>
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            rows={3}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio por noche</label>
                        <input
                            type="number"
                            value={editForm.night_cost}
                            onChange={(e) => setEditForm({...editForm, night_cost: Number(e.target.value)})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditPostForm 