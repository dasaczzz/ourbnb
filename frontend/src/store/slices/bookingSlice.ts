import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface BookingState {
  ourbnbServiceCost: number
}

const initialState: BookingState = {
  ourbnbServiceCost: 50000,
}

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
  },
})

export const selectOurbnbServiceCost = (state: RootState) => state.booking.ourbnbServiceCost

export default bookingSlice.reducer
