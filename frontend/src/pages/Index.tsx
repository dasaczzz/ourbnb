import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { startGetPosts } from '../store/thunks/postThunk'
import { PostState } from '../store/slices/postSlice'
import { HostCard } from '../components/index/HostCard'

export const Index = () => {

  const {posts} = useSelector((state: RootState) => state.post)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const getPosts = async() => {
      await dispatch(startGetPosts())
    }

    getPosts()
  }, [dispatch])

  return (
    <section className="container flex justify-between items-start content-start flex-wrap py-20 *:rounded-2xl">
      {posts.map((item: PostState) => (
        <HostCard post={item}/>
      ))}
    </section>
  )
}
