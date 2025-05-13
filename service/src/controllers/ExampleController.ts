import { Request, Response } from "express"
import { inject, injectable } from "inversify"
import { IExampleService } from "../services/interfaces/IExampleService"
import { TYPES } from "../util/Types"


@injectable()
export class ExampleController {
  
  constructor(
    @inject(TYPES.IExampleService) private exampleService: IExampleService
  ) { }

  getHello = (req: Request, res: Response): void => {
    const message = this.exampleService.getMessage()
    res.send({ message })
  }
  
}    