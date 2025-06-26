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

export const login = async (params: LoginParams): Promise<void> => {
  const res = await axios.post('/auth/login', params)

  if (res.status < 200 || res.status >= 300) {
    throw new Error('Failed to login')
  }

  return
}

const fetchNationalHolidays = async (year: string, countryCode: string) => {
  const res = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)

  if (res.status < 200 || res.status >= 300) {
    throw new Error('Failed to fetch categories')
  }

  //todo after register or maybe direcly in with register request
  // if (typeof res.data === 'object' && res.data !== null &&
  //   'date' in res.data && typeof res.data.date === 'string' &&
  //   'name' in res.data && typeof res.data.name === 'string'
  // ) {
  //   return res.data
  // }

  // return holidays
}