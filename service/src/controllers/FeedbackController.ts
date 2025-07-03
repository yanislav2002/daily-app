import { inject } from "inversify"
import { FeedbackParams, IFeedbackService } from "../services/interfaces/IFeedbackService.js"
import { controller, httpPost, request, response } from "inversify-express-utils"
import { Request, Response } from "express"
import { getErrorMessage } from "../util/ErrorUtils.js"
import { TYPES } from "../util/Types.js"


function isFeedbackParams(obj: unknown): obj is FeedbackParams {
  const data = obj as FeedbackParams
  return typeof data.message === 'string' && data.message.trim().length > 0
}

@controller('/feedback')
export class FeedbackController {
  
  constructor(
    @inject(TYPES.IFeedbackService) private readonly feedbackService: IFeedbackService
  ) {}

  @httpPost('/')
  public async submit(@request() req: Request, @response() res: Response) {
    const request: unknown = req.body

    if (!isFeedbackParams(request)) {
      res.status(400).json({ error: 'Invalid feedback format' })
      return
    }

    try {
      await this.feedbackService.submit(request)
      res.status(200).send()
    } catch (err) {
      console.error('Failed to submit feedback:', getErrorMessage(err))
      res.status(500).json({ error: 'Feedback submission failed' })
    }
  }
  
}