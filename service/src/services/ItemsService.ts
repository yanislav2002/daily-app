import { injectable } from "inversify"
import { CalendarItem, IItemsService } from "./interfaces/IItemsService.js"
import { CalendarItemEntity, TaskEntity } from "../model/ItemsEntity.js"
import { isTaskItem } from "../controllers/ItemsController.js"
import { TaskModel } from "../model/schemas/Items.schema.js"


@injectable()
export class ItemsService implements IItemsService {

  getAllItems(): CalendarItemEntity[] {
    throw new Error("Method not implemented.")
  }

  async insertItem(unknownItem: CalendarItem, userId: string): Promise<CalendarItemEntity> {
    //todo make it better

    if (isTaskItem(unknownItem)) {
      const newTask = await TaskModel.create({ ...unknownItem })
      
      console.log('New Task added successfully')

      const taskEntity: TaskEntity = {
        ...newTask.toObject(),
        id: newTask._id.toString()
      }

      return taskEntity
    }

    throw new Error('Invalid CalendarItem')
  }

}