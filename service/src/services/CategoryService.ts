import { injectable } from "inversify"
import { Category, ICategoryService } from "./interfaces/ICategoryService.js"
import { CategoryEntity } from "../model/CategoryEntity.js"
import { isCategoryEntity } from "../controllers/CategoryController.js"
import categoryChema from "../model/schemas/category.chema.js"


@injectable()
export class CategoryService implements ICategoryService {

  public fetch = async (userId: string): Promise<CategoryEntity[]> => {
    const docs = await categoryChema.find({ userId }).lean()

    const categoryEntities: CategoryEntity[] = docs.map(doc => {
      const { _id, ...rest } = doc
      const categoryEntity = {
        ...rest,
        id: _id.toString()
      }

      if (!isCategoryEntity(categoryEntity)) {
        throw new Error('Invalid CategoryEntity from DB')
      }

      return categoryEntity
    })

    console.log('Fetched categories successfully')
    return categoryEntities
  }

  public insert = async (category: Category, userId: string): Promise<CategoryEntity> => {
    const doc = await categoryChema.create({ ...category, userId })

    const categoryEntity = {
      ...category,
      id: doc._id.toString(),
      userId
    }

    if (!isCategoryEntity(categoryEntity)) {
      throw new Error('Invalid CategoryEntity after insert')
    }

    console.log('New category added successfully')
    return categoryEntity
  }

}