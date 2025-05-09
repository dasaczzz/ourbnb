import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  name: string | null;
  email: string | null;
  phone: string | null;
}

const initialState: UserState = {
  name: null,
  email: null,
  phone: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name
      state.email = action.payload.email
      state.phone = action.payload.phone
    },
    clearUser: (state) => {
      state.name = null
      state.email = null
      state.phone = null
    }
  }
})

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = userSlice.actions
