import { Modal, Form, Input } from 'antd'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { feedbackModalOpened, selectFeedbackModalOpened, submitFeedbackAsync } from './SchedulerSlice'


type FormValues = {
  email: string
  message: string
}

export const FeedbackModal = () => {
  const dispatch = useAppDispatch()
  const open = useAppSelector(selectFeedbackModalOpened)

  const [form] = Form.useForm<FormValues>()

  const onModalSubmit = async () => {
    try {
      await form.validateFields()

      form.submit()
    } catch {
      return
    }
  }

  const onFinish = async () => {
    const values = await form.validateFields()

    await dispatch(submitFeedbackAsync(values))
    setTimeout(() => {
      form.resetFields()
    }, 200)
  }

  const onModalCancel = () => {
    dispatch(feedbackModalOpened(false))
  }

  return (
    <>
      <Modal
        title="Send Feedback"
        open={open}
        onOk={onModalSubmit}
        onCancel={onModalCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Your Email (optional)"
            name="email"
            rules={[{ type: 'email', message: 'Enter a valid email' }]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <Input.TextArea rows={4} placeholder="Your feedback..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
