import { inject } from "inversify"
import { controller, httpPost, response, request } from "inversify-express-utils"
import { Request, Response } from "express"
import { IAuthService, LoginParams, RegisterParams } from "../services/interfaces/IAuthService.js"
import { TYPES } from "../util/Types.js"
import { getErrorMessage } from "../util/ErrorUtils.js"
import { ICategoryService } from "../services/interfaces/ICategoryService.js"
import { IItemsService } from "../services/interfaces/IItemsService.js"


export const isLoginParams = (value: unknown): value is LoginParams => {
  return (
    typeof value === 'object' && value !== null &&
    'mail' in value && typeof value.mail === 'string' &&
    'password' in value && typeof value.password === 'string'
  )
}

export const isRegisterParams = (value: unknown): value is RegisterParams => {
  return (
    typeof value === 'object' && value !== null &&
    'username' in value && typeof value.username === 'string' &&
    'password' in value && typeof value.password === 'string' &&
    'mail' in value && typeof value.mail === 'string' &&
    'countryCode' in value && typeof value.countryCode === 'string'
  )
}

@controller('/auth')
export class AuthController {

  constructor(
    @inject(TYPES.IAuthService) private authService: IAuthService,
    @inject(TYPES.ICategoryService) private categoryService: ICategoryService,
    @inject(TYPES.IItemsService) private itemService: IItemsService
  ) { }

  @httpPost('/register')
  public async register(@request() req: Request, @response() res: Response) {
    const request: unknown = req.body

    if (!isRegisterParams(request)) {
      res.status(400).json({ error: 'Invalid request format' })
      return
    }

    try {
      const userId = await this.authService.register(request)

      const category = await this.categoryService.insert({ name: 'Official Holidays', color: '#FFCC00' }, userId)

      await this.itemService.addOfficialHolidays(category, request.countryCode, userId)

      res.status(200).json(userId)
    } catch (err) {
      console.error('Failed to register user:', getErrorMessage(err))
      res.status(500).json({ error: 'Registration failed' })
    }
  }

  @httpPost('/login')
  public async login(@request() req: Request, @response() res: Response) {
    const request: unknown = req.body

    if (!isLoginParams(request)) {
      res.status(400).json({ error: 'Invalid request format' })
      return
    }

    try {
      const userId = await this.authService.login(request)
      res.status(200).json(userId)
    } catch (err) {
      console.error('Login failed:', getErrorMessage(err))
      res.status(401).json({ error: 'Invalid email or password' })
    }
  }

}