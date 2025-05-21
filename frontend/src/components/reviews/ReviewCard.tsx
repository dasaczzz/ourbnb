import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDeleteBooking, fetchReviewsByPostId } from '../../lib/api'
import { toast } from 'sonner'
import { AppDispatch } from '../../store/store'
import { startGetBookingsByUser } from '../../store/thunks/bookingThunk'
import { Link, useNavigate, useParams } from 'react-router-dom'

interface Review {
  id: string;
  comment: string;
  date_review: Date;
  qualification: number;
  user_id: string;
  post_id: string;
  user: {
    name: string;
    profilepic: string;
  };
}

export const ReviewCard = () => {
  const { post_id } = useParams()
  const state = useSelector((state:any) => state.user)
  const [reviews, setReviews] = useState<Review[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  /*cambiar esto a reviews
  const handleDeleteBooking = async(id: string) => {
    const response = await fetchDeleteBooking(id)
    if (!response) {
      toast.error('No se pudo cancelar la reservación.')
      return
    }
    toast.success('Reservación cancelada con éxito.')
    await dispatch(startGetBookingsByUser(state.id))
    navigate('/')
  }
  */

  useEffect(() => {
    const getReviews = async () => {
      try {
        if (!post_id) return;
        const reviews = await fetchReviewsByPostId(post_id)
        setReviews(reviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }
    getReviews()
  }, [post_id])

  return (
    <div className="flex-[0.6] w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold mt-3 mb-2">Reseñas</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl">
          {reviews.map((review, index) => (
            <div key={`${review.id}-${index}`} className="bg-white rounded-2xl shadow-md p-3 max-w-xs flex flex-row gap-4 transition duration-200 hover:bg-gray-100">
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2 mb-2">
                  <img src={"no hay fotico"} alt={"nombre"} className="w-10 h-10 rounded-full object-cover"/>
                  <div>
                    <h3 className="font-semibold">{"todavía no se como poner el nombre jaja :("}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.date_review).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < review.qualification ? 'text-blue-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>

        {/* si no hay reviews */}
        {!reviews.length && (
          <div className='flex items-center'>
            <p className="text-sm text-gray-500 mr-1.5">La publicación no tiene reseñas. ¡Haz la primera!</p>
          </div>
        )}
      </div>
    </div>
  )
}
