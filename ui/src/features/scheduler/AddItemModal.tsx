import {
  ColorPicker,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Tag,
  TimePicker
} from 'antd'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  addItemModalOpened,
  categoriesSelectors,
  formFieldAllDaySwitched,
  formFieldHasCategorySwitched,
  formFieldHasTodoListSwitched,
  insertItemAsync,
  modalItemTypeChanged,
  selectModalState
} from './SchedulerSlice'
import { Item, ItemType, Priority } from './SchedulerAPI'
import { Dayjs } from 'dayjs'
import type { Color } from 'antd/es/color-picker'
import { CheckOutlined, PlusOutlined } from '@ant-design/icons'


type FormValues = {
  title: string
  date: Dayjs | undefined
  description: string
  itemTypes: ItemType
  colorPicker: Color | string
  allDay: boolean
  timeRange: [Dayjs, Dayjs] | undefined
  remindAt: Dayjs | undefined
  deadline: Dayjs | undefined
  labelList: string[]
  priority: Priority
  category: string | undefined
}

const initialFormValues: FormValues = {
  title: '',
  date: undefined,
  description: '',
  itemTypes: 'event',
  colorPicker: '#f5a623',
  allDay: false,
  timeRange: undefined,
  remindAt: undefined,
  deadline: undefined,
  labelList: [],
  priority: 'low',
  category: undefined
}

const itemTypeOptions = [
  { label: 'Event', value: 'event' },
  { label: 'Task', value: 'task' },
  { label: 'Reminder', value: 'reminder' }
]

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' }
]

const transformFormValuesToCalendarItem = (values: FormValues, hasCategory: boolean, categoryColor: string): Item => {
  const colorString = typeof values.colorPicker === 'string'
    ? values.colorPicker
    : values.colorPicker.toHexString()

  const baseItem = {
    type: values.itemTypes,
    title: values.title,
    date: values.date?.format('DD-MM-YYYY') ?? '',
    description: values.description || '',
    color: hasCategory ? categoryColor : colorString,
    repeat: undefined, //todo
    categoryId: hasCategory ? values.category : undefined
  }

  switch (values.itemTypes) {
    case 'task': {
      return {
        ...baseItem,
        details: {
          deadline: values.deadline?.format("DD-MM-YYYY HH:mm") ?? undefined,
          completed: false,
          priority: values.priority,
          status: 'not_started',
          startTime: values.timeRange?.[0].format('HH:mm') ?? undefined,
          endTime: values.timeRange?.[1].format('HH:mm') ?? undefined,
          todoList: values.labelList.map(label => ({ text: label, done: false })),
          estimatedTime: undefined //todo
        }
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

    case 'reminder': {
      return {
        ...baseItem,
        details: {
          remindAt: values.remindAt?.format('HH:mm') ?? ''
        }
      }
    }

    default: {
      throw new Error('Unsupported item type')
    }
  }
}

export const AddItemModal: React.FC = () => {
  const dispatch = useAppDispatch()

  const categories = useAppSelector(categoriesSelectors.selectAll)
  const { open, fields } = useAppSelector(selectModalState)
  const { itemType, allDay, hasTodoList, hasCategory } = fields

  const [form] = Form.useForm<FormValues>()

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: (
      <Space size="small">
        <Tag color={category.color} style={{ margin: 0, padding: 0, width: 10, height: 10, borderRadius: 10 }} />
        {category.name}
      </Space>
    )
  }))

  const onFinish = async (values: FormValues) => {
    try {
      const category = categories.find(cat => cat.id === values.category)

      const item = transformFormValuesToCalendarItem(values, hasCategory, category?.color ?? '')

      await dispatch(insertItemAsync(item))
    } catch (err: unknown) {
      console.log(err)
      return
    }
  }

  const resetFormAndState = () => {
    form.resetFields()
    dispatch(modalItemTypeChanged('event'))
    dispatch(formFieldHasCategorySwitched(false))
    dispatch(formFieldHasTodoListSwitched(false))
    dispatch(formFieldAllDaySwitched(false))
  }

  const onModalCancel = () => {
    dispatch(addItemModalOpened(false))
    resetFormAndState()
  }

  const onModalSubmit = async () => {
    try {
      await form.validateFields()

      form.submit()
      setTimeout(() => {
        resetFormAndState()
      }, 200)
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
      okText='Add'
      destroyOnHidden
    >
      <Form
        form={form}
        initialValues={initialFormValues}
        validateTrigger={['onChange', 'onSubmit']}
        onFinish={onFinish}
        style={{ marginTop: '30px' }}
      >
        <Flex gap={'10px'}>
          <Form.Item
            name='title'
            style={{ flex: 1 }}
            validateDebounce={300}
            rules={[
              { required: true, message: 'Title is required' },
              { max: 30, message: 'Title cannot be longer than 30 characters' }
            ]}
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
            <ColorPicker disabled={hasCategory} />
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

        <Flex gap='10px'>
          <Switch
            style={{ marginTop: '5px' }}
            onChange={(value: boolean) => { dispatch(formFieldHasCategorySwitched(value)) }}
          />

          <Form.Item name='category' style={{ width: '100%' }}>
            <Select
              disabled={!hasCategory}
              options={categoryOptions}
              placeholder="Select a category"
            />
          </Form.Item>
        </Flex>

        <Divider style={{ marginTop: '0px' }} />

        <Flex gap='10px'>
          {
            itemType === 'task' &&
            <Switch
              style={{ marginTop: '6px' }}
              checkedChildren={<><CheckOutlined /> To-Do</>}
              unCheckedChildren={<><PlusOutlined /> To-Do</>}
              onChange={(value: boolean) => { dispatch(formFieldHasTodoListSwitched(value)) }}
            />
          }

          <Form.Item
            name='deadline'
            hidden={itemType !== 'task'}
            style={{ flex: 1 }}
            validateDebounce={300}
          >
            <DatePicker
              showTime
              format='DD-MM-YYYY HH:mm'
              placeholder={'Deadline'}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name='priority'
            hidden={itemType !== 'task'}
            style={{ flex: 1 }}
            validateDebounce={300}
            rules={[{ required: itemType === 'task', message: 'Priority is required' }]}
          >
            <Select options={priorityOptions} />
          </Form.Item>
        </Flex>

        <Form.Item
          name='labelList'
          hidden={!(itemType === 'task' && hasTodoList)}
          style={{ flex: 1 }}
          validateDebounce={300}
        >
          <Select
            mode='tags'
            style={{ width: '100%' }}
            placeholder='Add to-do items by pressing Enter'
            tokenSeparators={[',']}
            open={false}
          />
        </Form.Item>

        <Flex gap={'10px'} >
          <Form.Item name='allDay' hidden={itemType !== 'event'}>
            <Switch
              size='default'
              checkedChildren='All Day'
              unCheckedChildren='Custom Time'
              defaultChecked={false}
              onChange={(value: boolean) => { dispatch(formFieldAllDaySwitched(value)) }}
            />
          </Form.Item>

          <Form.Item
            name='timeRange'
            hidden={itemType !== 'event' && itemType !== 'task'}
            style={{ flex: 1 }}
            validateDebounce={300}
            rules={[{
              required: (itemType === 'event' && !allDay) || itemType === 'task',
              message: 'Time Range is required'
            }]}
          >
            <TimePicker.RangePicker
              disabled={allDay && itemType === 'event'}
              allowEmpty
              format='HH:mm'
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Flex>

        <Form.Item
          name='remindAt'
          hidden={itemType !== 'reminder'}
          style={{ flex: 1 }}
          validateDebounce={300}
          rules={[{
            required: itemType === 'reminder',
            message: 'Time is required'
          }]}
        >
          <TimePicker
            format='HH:mm'
            placeholder={'Remind at'}
            style={{ width: '100%' }}
          />
        </Form.Item>

      </Form>
    </Modal>
  )
} 