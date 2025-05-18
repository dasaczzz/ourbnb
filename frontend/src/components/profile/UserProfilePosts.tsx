import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { startGetPostsByUser } from '../../store/thunks/postThunk'

export const UserProfilePosts = () => {

    const user = useSelector((state: any) => state.user)
    const userPosts = useSelector((state: any) => state.post.userPosts ?? []);
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (user.id) {
            dispatch(startGetPostsByUser(user.id))
        }
    }, [dispatch, user.id])

    return (
      <div className="flex-1">
      <h2 className="text-2xl font-bold mb-2">Tus Publicaciones</h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-5 shadow-xl rounded-xl"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        {userPosts.map((post: any) => (
          <motion.div
            key={post.id}
            className="rounded-2xl shadow-md p-3 max-w-xs flex flex-col gap-4 hover:bg-gray-100 transition duration-200"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link to={`/post/${post.id}`} className="flex flex-col gap-2 w-full">
              <div className="overflow-hidden rounded-xl flex-shrink-0 w-full h-40 mx-auto">
                <img src={post.images?.[0]} alt={post.title} className="w-full h-full object-cover rounded-xl"/>
              </div>
              <h2 className="font-semibold text-lg">{post.title}</h2>
              <p className="text-gray-600 font-semibold">
                {post.night_cost?.toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'COP',
                })} noche
              </p>
              <p className='text-sm border border-gray-200 shadow-sm rounded-xl p-2'>Todavía no se puede editar :c</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      {!userPosts.length && (
        <p className="text-sm text-gray-500">Este anfitrión aún no tiene publicaciones.</p>
      )}
    </div>
    );
}

export default UserProfilePosts;