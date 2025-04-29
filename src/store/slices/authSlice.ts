import { createSlice } from '@reduxjs/toolkit'

enum states {
  // eslint-disable-next-line no-unused-vars
  AUTHENTICATED, NOT_AUTHENTICATED, CHECKING
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: states.NOT_AUTHENTICATED,
    email: null,
    name: null,
    phone: null,
    password: null,
    confirmPassowrd: null,
    token: 0,
    errorMessage: null
  },

  reducers: {
    register: (state, {payload}) => {
      state.status = states.AUTHENTICATED
      state.email = payload.email
      state.name = payload.name
      state.phone = payload.phone
      state.password = payload.password
      state.confirmPassowrd = payload.confirmPassword
      state.errorMessage = null
      state.token = Math.floor(Math.random() * 100)
    },

    checkingCredentials: (state) => {
      state.status = states.CHECKING
    }
  },
})

// Action creators are generated for each case reducer function
export const { register } = authSlice.actions
