import { ColorPicker, DatePicker, Divider, Flex, Form, Input, Modal, Select, Switch, TimePicker } from 'antd'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addItemModalOpened, modalItemTypeChanged, selectModalState } from './SchedulerSlice'
import { ItemType, Priority } from './SchedulerAPI'

type FormValues = {
  title: string
  date: string
  description: string
  itemTypes: ItemType
  colorPicker: string
  allDay: boolean
  timeRange: string
  time: string
  labelList: string[]
  priority: Priority
  label: string
}

const initialFormValues: FormValues = {
  title: '',
  date: '',
  description: '',
  itemTypes: 'event',
  colorPicker: '#f5a623',
  allDay: false,
  timeRange: '',
  time: '',
  labelList: [],
  priority: 'low',
  label: ''
}

const itemTypeOptions = [
  { label: 'Event', value: 'event' },
  { label: 'Task', value: 'task' },
  { label: 'Reminder', value: 'reminder' },
  { label: 'To-do List', value: 'todoList' },
  { label: 'Goal', value: 'goal' },
  { label: 'Birthday', value: 'birthday' }
]

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' }
]

export const AddItemModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const { open, itemType } = useAppSelector(selectModalState)

  const [form] = Form.useForm<FormValues>()

  const onFinish = (values: FormValues) => {
    console.log(values)
  }

  const onModalCancel = () => {
    dispatch(addItemModalOpened(false))
    form.resetFields()
  }

  const onModalSubmit = () => {
    form.submit()
    form.resetFields()
  }

  return (
    <Modal
      title='Add Activity'
      open={open}
      onCancel={onModalCancel}
      onOk={onModalSubmit}
      destroyOnHidden
    >
      <Form
        form={form}
        initialValues={initialFormValues}
        onFinish={onFinish}
      >
        <Flex gap={'10px'} style={{ marginTop: '30px' }}>
          <Form.Item name='title' required style={{ flex: 1 }}>
            <Input placeholder='Title' />
          </Form.Item>

          <Form.Item name='itemTypes' required style={{ flex: 1 }}>
            <Select
              options={itemTypeOptions}
              onChange={(value: ItemType) => { dispatch(modalItemTypeChanged(value)) }}
            />
          </Form.Item>

          <Form.Item name='colorPicker'>
            <ColorPicker />
          </Form.Item>
        </Flex>

        <Form.Item name='date' required>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name='description'>
          <Input.TextArea placeholder='Description' autoSize={{ minRows: 3, maxRows: 3 }} />
        </Form.Item>

        <Divider />

        <Flex gap={'10px'} >
          <Form.Item name='timeRange' hidden={itemType !== 'event'} style={{ flex: 1 }}>
            <TimePicker.RangePicker format='HH:mm' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name='allDay' hidden={itemType !== 'event'}>
            <Switch
              size='default'
              checkedChildren='All Day'
              unCheckedChildren='Custom Time'
              defaultChecked={false}
            />
          </Form.Item>
        </Flex>

        <Flex gap={'10px'} >
          <Form.Item name='priority' required hidden={itemType !== 'task'} style={{ flex: 1 }}>
            <Select options={priorityOptions} />
          </Form.Item>

          <Form.Item name='label' required hidden={itemType !== 'birthday'} style={{ flex: 1 }}>
            <Input placeholder='Person Name' />
          </Form.Item>

          <Form.Item
            name='time'
            hidden={itemType !== 'task' && itemType !== 'reminder' && itemType !== 'goal'}
            style={{ flex: 1 }}
          >
            <TimePicker format='HH:mm' placeholder='Remind at' style={{ width: '100%' }} />
          </Form.Item>
        </Flex>

        <Form.Item
          name='labelList'
          hidden={itemType !== 'todoList' && itemType !== 'birthday' && itemType !== 'goal'}
          style={{ flex: 1 }}
        >
          <Select
            mode='tags'
            style={{ width: '100%' }}
            placeholder='Add to-do items by pressing Enter'
            tokenSeparators={[',']}
            open={false}
          />
        </Form.Item>

      </Form>
    </Modal>
  )
} 