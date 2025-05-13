import { Container } from 'inversify'

import { ExampleController } from './controllers/ExampleController'
import { ExampleService } from './services/ExampleService'
import { IExampleService } from './services/interfaces/IExampleService'
import { TYPES } from './util/Types'

const container = new Container()

container.bind<IExampleService>(TYPES.IExampleService).to(ExampleService).inSingletonScope()

container.bind<ExampleController>(ExampleController).toSelf().inSingletonScope()

export { container }
