import { controller, httpGet, httpPost, request, response } from "inversify-express-utils"
import { TYPES } from "../util/Types.js"
import { Request, Response } from "express"
import { getErrorMessage } from "../util/ErrorUtils.js"
import { inject } from "inversify"
import { Category, ICategoryService } from "../services/interfaces/ICategoryService.js"
import { CategoryEntity } from "../model/CategoryEntity.js"


export const isCategory = (value: unknown): value is Category => {
  return (
    typeof value === 'object' && value !== null &&
    'name' in value && typeof value.name === 'string' &&
    'color' in value && typeof value.color === 'string' &&
    (
      !('description' in value) || typeof value.description === 'string'
    )
  )
}

export const isCategoryEntity = (value: unknown): value is CategoryEntity => {
  return (
    typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'userId' in value && typeof value.userId === 'string' &&
    isCategory(value)
  )
}

@controller('/category')
export class CategoryController {

  constructor(
    @inject(TYPES.ICategoryService) private categoryService: ICategoryService
  ) { }

  @httpGet('/fetch')
  public async fetchCategories(@request() req: Request, @response() res: Response) {
    const userId = req.query.userId

    if (typeof userId !== 'string') {
      res.status(400).json({ error: 'Missing or invalid userId query parameter' })
      return
    }

    try {
      const categories = await this.categoryService.fetch(userId)
      res.status(200).json(categories)
    } catch (err) {
      console.error('Failed to fetch categories: ', getErrorMessage(err))
      res.status(500).json({ error: 'Failed to fetch categories' })
    }
  }

  @httpPost('/insert')
  public async addCategory(@request() req: Request, @response() res: Response) {
    const request: unknown = req.body

    if (
      typeof request !== 'object' || request === null ||
      !('userId' in request) || typeof request.userId !== 'string' ||
      !('category' in request) || !isCategory(request.category)
    ) {
      console.log('Invalid request format')
      res.status(400).json({ error: 'Invalid request format' })
      return
    }

    try {
      const categoryEntity = await this.categoryService.insert(request.category, request.userId)
      res.status(200).json(categoryEntity)
    } catch (err) {
      console.error('Failed to insert category: ', getErrorMessage(err))
      res.status(500).json({ error: 'Failed to insert category' })
    }
  }

}
