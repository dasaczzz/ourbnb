import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { startGetPosts } from '../store/thunks/postThunk'
import { PostState } from '../store/slices/postSlice'
import { HostCard } from '../components/index/HostCard'
import { Link } from 'react-router-dom'

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
    <section className="container flex justify-between items-start content-start flex-wrap py-20">
      {posts.map((item: PostState) => (
        <Link to={`/post/${item.id}`} key={item.id}>
        <HostCard post={item}/>
        </Link>
      ))}
    </section>
  )
}
