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

export type IAuthService = {
  register(params: RegisterParams): Promise<string>
  login(params: LoginParams): Promise<string>
}