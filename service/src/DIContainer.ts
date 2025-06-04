import { Container } from 'inversify'

import { ExampleController } from './controllers/ExampleController.js'
import { ExampleService } from './services/ExampleService.js'
import { IExampleService } from './services/interfaces/IExampleService.js'
import { TYPES } from './util/Types.js'
import { ItemsService } from './services/ItemsService.js'
import { IItemsService } from './services/interfaces/IItemsService.js'
import { ItemsController } from './controllers/ItemsController.js'

const container = new Container()

container.bind<IExampleService>(TYPES.IExampleService).to(ExampleService).inSingletonScope()
container.bind<IItemsService>(TYPES.IItemsService).to(ItemsService).inSingletonScope()

container.bind<ExampleController>(ExampleController).toSelf().inSingletonScope()
container.bind<ItemsController>(ItemsController).toSelf().inSingletonScope()

export { container }
