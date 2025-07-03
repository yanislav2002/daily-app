export type FeedbackParams = {
  email?: string
  message: string
  createdAt?: Date
}

export type IFeedbackService = {
  submit(params: FeedbackParams): Promise<void>
}