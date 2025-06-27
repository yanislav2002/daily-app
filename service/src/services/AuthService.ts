import { injectable } from "inversify"
import { IAuthService, LoginParams, RegisterParams } from "./interfaces/IAuthService.js"
import User from "../model/schemas/auth.schema.js"
import bcrypt from 'bcrypt'


@injectable()
export class AuthService implements IAuthService {

  public register = async (params: RegisterParams) => {
    const existingUser = await User.findOne({ mail: params.mail })

    if (existingUser) {
      throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(params.password, 10)

    const newUser = await User.create({
      ...params,
      password: hashedPassword
    })

    console.log('Registration successfully created')
    return newUser._id.toString()
  }

  public login = async (params: LoginParams) => {
    const user = await User.findOne({ mail: params.mail }).lean()
    
    if (!user || typeof user.password !== 'string') {
      throw new Error('Wrong password or username')
    }

    const isMatch = await bcrypt.compare(params.password, user.password)

    if (!isMatch) {
      throw new Error('Wrong password or username')
    }

    console.log('Login successfully completed')
    return user._id.toString()
  }

}