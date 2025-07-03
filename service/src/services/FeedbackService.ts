import { injectable } from "inversify"
import { FeedbackParams, IFeedbackService } from "./interfaces/IFeedbackService.js"
import { Feedback } from "../model/schemas/feedback.model.js"


@injectable()
export class FeedbackService implements IFeedbackService {

  public async submit(params: FeedbackParams): Promise<void> {
    const result = await Feedback.create({
      email: params.email,
      message: params.message,
      createdAt: new Date()
    })

    console.log('Feedback submitted:', result._id.toString())
    return
  }

}