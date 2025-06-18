import { ColorPicker, Flex, Form, Input, Modal } from "antd"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { categoryModalOpened, insertCategoryAsync, selectCategoryModal } from "./SchedulerSlice"
import { Color } from "antd/es/color-picker"
import { Category } from "./SchedulerAPI"


type FormValues = {
  name: string
  description: string
  color: string | Color
}

const initialFormValues: FormValues = {
  name: '',
  color: 'f5a623',
  description: ''
}

const transformFormValuesToCategory = (values: FormValues): Category => {
  const colorString = typeof values.color === 'string'
    ? values.color
    : values.color.toHexString()

  return {
    name: values.name,
    color: colorString,
    description: values.description
  }
}

export const CategoryModal: React.FC = () => {
  const dispatch = useAppDispatch()

  const { open } = useAppSelector(selectCategoryModal)

  const [form] = Form.useForm<FormValues>()

  const onModalCancel = () => {
    dispatch(categoryModalOpened(false))
    form.resetFields()
  }

  const onFinish = async (values: FormValues) => {
    try {
      const category = transformFormValuesToCategory(values)

      await dispatch(insertCategoryAsync(category))
    } catch (err: unknown) {
      console.log(err)
      return
    }
  }

  const onModalSubmit = async () => {
    try {
      await form.validateFields()

      form.submit()
      setTimeout(() => { form.resetFields() }, 200)
    } catch {
      return
    }
  }

  return (
    <Modal
      title='Create Category'
      open={open}
      onCancel={onModalCancel}
      onOk={onModalSubmit}
      okText='Submit'
      destroyOnHidden
    >
      <Form
        form={form}
        initialValues={initialFormValues}
        onFinish={onFinish}
        validateTrigger={['onChange', 'onSubmit']}
        style={{ marginTop: '30px' }}
      >
        <Flex gap='10px'>
          <Form.Item
            name='name'
            style={{ flex: 1 }}
            validateDebounce={300}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder='Name of Category' />
          </Form.Item>

          <Form.Item name='color'>
            <ColorPicker />
          </Form.Item>
        </Flex>

        <Form.Item name='description'>
          <Input.TextArea placeholder='Description' autoSize={{ minRows: 3, maxRows: 3 }} />
        </Form.Item>
      </Form>

    </Modal>
  )
}