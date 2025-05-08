import Cookies from 'js-cookie'

export const getToken = () => {
  return Cookies.get('token') || null
}

export const setToken = (val: string) => {
  Cookies.set('token', val, {
    expires: 1 / 12,     // 2 hours
    sameSite: 'Strict',
  })
}

export const removeToken = () => {
  Cookies.remove('token')
}
