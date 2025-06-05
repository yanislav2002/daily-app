import { ColorPicker, DatePicker, Divider, Flex, Form, Input, Modal, Select, Switch, TimePicker } from 'antd'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  addItemModalOpened,
  formFieldAllDaySwitched,
  insertItemAsync,
  modalItemTypeChanged,
  selectModalState
} from './SchedulerSlice'
import { Item, ItemType, Priority } from './SchedulerAPI'
import { Dayjs } from 'dayjs'


type FormValues = {
  title: string
  date: Dayjs | undefined
  description: string
  itemTypes: ItemType
  colorPicker: string
  allDay: boolean
  timeRange: [Dayjs, Dayjs] | undefined
  time: Dayjs | undefined
  labelList: string[]
  priority: Priority
  label: string
}

const initialFormValues: FormValues = {
  title: '',
  date: undefined,
  description: '',
  itemTypes: 'event',
  colorPicker: '#f5a623',
  allDay: false,
  timeRange: undefined,
  time: undefined,
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

const transformFormValuesToCalendarItem = (values: FormValues): Item => {
  const baseItem = {
    type: values.itemTypes,
    title: values.title,
    date: values.date?.format('DD-MM-YYYY') ?? '',
    description: values.description || '',
    color: values.colorPicker
  }

  switch (values.itemTypes) {
    case 'task':
      return {
        ...baseItem,
        details: {
          deadline: values.time?.format('HH:mm') ?? '',
          completed: false,
          priority: values.priority
        }
      }

    case 'event': {
      return {
        ...baseItem,
        details: {
          startTime: values.timeRange?.[0].format('HH:mm') ?? '',
          endTime: values.timeRange?.[1].format('HH:mm') ?? '',
          allDay: values.allDay
        }
      }
    }

    case 'reminder':
      return {
        ...baseItem,
        details: {
          remindAt: values.time?.format('HH:mm') ?? ''
        }
      }

    case 'todoList':
      return {
        ...baseItem,
        details: {
          items: values.labelList.map(label => ({ text: label, done: false }))
        }
      }

    case 'goal':
      return {
        ...baseItem,
        details: {
          deadline: values.time?.format('HH:mm') ?? '',
          progress: 0,
          steps: values.labelList.map(label => ({ text: label, done: false }))
        }
      }

    case 'birthday':
      return {
        ...baseItem,
        details: {
          personName: values.label,
          giftIdeas: values.labelList.length > 0 ? values.labelList : []
        }
      }

    default:
      throw new Error('Unsupported item type')
  }
}

export const AddItemModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const { open, fields } = useAppSelector(selectModalState)
  const { itemType, allDay } = fields

  const [form] = Form.useForm<FormValues>()

  const onFinish = async (values: FormValues) => {
    try {
      const item = transformFormValuesToCalendarItem(values)
      
      console.log(item)

      await dispatch(insertItemAsync(item))
    } catch (err: unknown) {
      console.log(err)
      return
    }
  }

  const onModalCancel = () => {
    dispatch(addItemModalOpened(false))
    form.resetFields()
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
      title='Add Activity'
      open={open}
      onCancel={onModalCancel}
      onOk={onModalSubmit}
      destroyOnHidden
    >
      <Form
        form={form}
        initialValues={initialFormValues}
        validateTrigger={['onChange', 'onSubmit']}
        onFinish={onFinish}
      >
        <Flex gap={'10px'} style={{ marginTop: '30px' }}>
          <Form.Item
            name='title'
            style={{ flex: 1 }}
            validateDebounce={300}
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder='Title' />
          </Form.Item>

          <Form.Item
            name='itemTypes'
            style={{ flex: 1 }}
            required
          >
            <Select
              options={itemTypeOptions}
              onChange={(value: ItemType) => { dispatch(modalItemTypeChanged(value)) }}
            />
          </Form.Item>

          <Form.Item name='colorPicker'>
            <ColorPicker />
          </Form.Item>
        </Flex>

        <Form.Item
          name='date'
          validateDebounce={300}
          rules={[{ required: true, message: 'Date is required' }]}
        >
          <DatePicker format='DD-MM-YYYY' style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name='description'>
          <Input.TextArea placeholder='Description' autoSize={{ minRows: 3, maxRows: 3 }} />
        </Form.Item>

        <Divider />

        <Flex gap={'10px'} >
          <Form.Item
            name='timeRange'
            hidden={itemType !== 'event'}
            style={{ flex: 1 }}
            validateDebounce={300}
            rules={[{ required: itemType === 'event' && !allDay, message: 'Time Range is required' }]}
          >
            <TimePicker.RangePicker disabled={allDay} allowEmpty format='HH:mm' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name='allDay' hidden={itemType !== 'event'}>
            <Switch
              size='default'
              checkedChildren='All Day'
              unCheckedChildren='Custom Time'
              defaultChecked={false}
              onChange={(value: boolean) => { dispatch(formFieldAllDaySwitched(value)) }}
            />
          </Form.Item>
        </Flex>

        <Flex gap={'10px'} >
          <Form.Item
            name='priority'
            hidden={itemType !== 'task'}
            style={{ flex: 1 }}
            validateDebounce={300}
            rules={[{ required: itemType === 'task', message: 'Priority is required' }]}
          >
            <Select options={priorityOptions} />
          </Form.Item>

          <Form.Item
            name='label'
            hidden={itemType !== 'birthday'}
            style={{ flex: 1 }}
            validateDebounce={300}
            rules={[{ required: itemType === 'birthday', message: 'Person Name is required' }]}
          >
            <Input placeholder='Person Name' />
          </Form.Item>

          <Form.Item
            name='time'
            hidden={itemType !== 'task' && itemType !== 'reminder' && itemType !== 'goal'}
            style={{ flex: 1 }}
            validateDebounce={300}
            rules={[{
              required: itemType === 'task' || itemType === 'reminder' || itemType === 'goal',
              message: 'Time is required'
            }]}
          >
            <TimePicker format='HH:mm' placeholder='Remind at' style={{ width: '100%' }} />
          </Form.Item>
        </Flex>

        <Form.Item
          name='labelList'
          hidden={itemType !== 'todoList' && itemType !== 'birthday' && itemType !== 'goal'}
          style={{ flex: 1 }}
          validateDebounce={300}
          rules={[{
            required: itemType === 'todoList' || itemType === 'birthday' || itemType === 'goal',
            message: 'Field is required'
          }]}
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