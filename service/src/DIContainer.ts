import { Container } from 'inversify'
import { TYPES } from './util/Types.js'
import { ItemsService } from './services/ItemsService.js'
import { IItemsService } from './services/interfaces/IItemsService.js'
import { ItemsController } from './controllers/ItemsController.js'
import { ICategoryService } from './services/interfaces/ICategoryService.js'
import { CategoryService } from './services/CategoryService.js'
import { CategoryController } from './controllers/CategoryController.js'
import { IAuthService } from './services/interfaces/IAuthService.js'
import { AuthController } from './controllers/AuthController.js'
import { AuthService } from './services/AuthService.js'
import { IFeedbackService } from './services/interfaces/IFeedbackService.js'
import { FeedbackService } from './services/FeedbackService.js'
import { FeedbackController } from './controllers/FeedbackController.js'


const container = new Container()

container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService).inSingletonScope()
container.bind<IItemsService>(TYPES.IItemsService).to(ItemsService).inSingletonScope()
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope()
container.bind<IFeedbackService>(TYPES.IFeedbackService).to(FeedbackService).inSingletonScope()

container.bind<CategoryController>(CategoryController).toSelf().inSingletonScope()
container.bind<ItemsController>(ItemsController).toSelf().inSingletonScope()
container.bind<AuthController>(AuthController).toSelf().inSingletonScope()
container.bind<FeedbackController>(FeedbackController).toSelf().inSingletonScope()

export { container }
