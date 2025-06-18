import { Container } from 'inversify'
import { TYPES } from './util/Types.js'
import { ItemsService } from './services/ItemsService.js'
import { IItemsService } from './services/interfaces/IItemsService.js'
import { ItemsController } from './controllers/ItemsController.js'
import { ICategoryService } from './services/interfaces/ICategoryService.js'
import { CategoryService } from './services/CategoryService.js'
import { CategoryController } from './controllers/CategoryController.js'


const container = new Container()

container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService).inSingletonScope()
container.bind<IItemsService>(TYPES.IItemsService).to(ItemsService).inSingletonScope()

container.bind<CategoryController>(CategoryController).toSelf().inSingletonScope()
container.bind<ItemsController>(ItemsController).toSelf().inSingletonScope()

export { container }
