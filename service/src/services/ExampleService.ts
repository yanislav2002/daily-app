import { injectable } from "inversify"
import { IExampleService } from "./interfaces/IExampleService.js"

@injectable()
export class ExampleService implements IExampleService {

  getMessage(): string {
    return "Hello from service!"
  }

}