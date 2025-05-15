import { fetchBookingsByUser } from '../../lib/api'
import { setBookings } from '../slices/bookingSlice'
import { AppDispatch } from '../store'

export const startGetBookingsByUser = (user_id: string) => {
  return async(dispatch: AppDispatch) => {
    try {
      const data = await fetchBookingsByUser(user_id)
      dispatch(setBookings(data))
    } catch (error) {
      console.error(error)
    }
  }
}
