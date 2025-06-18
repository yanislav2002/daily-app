import { CategoryEntity } from "../../model/CategoryEntity.js"


export type Category = {
  name: string
  color: string
  description?: string
}

export type ICategoryService = {
  fetch(userId: string): Promise<CategoryEntity[]>
  insert(category: Category, userId: string): Promise<CategoryEntity>
}