import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface BookingState {
  ourbnbServiceCost: number
  bookings: any[]
}

const initialState: BookingState = {
  ourbnbServiceCost: 50000,
  bookings: [],
}

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload
    },
  },
})

export const selectOurbnbServiceCost = (state: RootState) => state.booking.ourbnbServiceCost
export const selectBookings = (state: RootState) => state.booking.bookings

export const { setBookings } = bookingSlice.actions

export default bookingSlice.reducer
