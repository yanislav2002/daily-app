import axios from "axios"


export type LoginParams = {
  mail: string
  password: string
}

export type RegisterParams = {
  username: string
  password: string
  mail: string
  countryCode: string
}

export const register = async (params: RegisterParams): Promise<string> => {
  const res = await axios.post('/auth/register', params)

  if (res.status < 200 || res.status >= 300) {
    throw new Error('Failed to register')
  }

  if (typeof res.data === 'string') {
    return res.data
  }

  throw new Error('Invalid Response Data')
}

export const login = async (params: LoginParams): Promise<string> => {
  const res = await axios.post('/auth/login', params)

  if (res.status < 200 || res.status >= 300) {
    throw new Error('Failed to login')
  }

  if (typeof res.data === 'string') {
    return res.data
  }

  throw new Error('Invalid Response Data')
}