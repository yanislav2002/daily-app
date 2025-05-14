import { Checkbox, ColorPicker, DatePicker, Form, Input, Modal, Select, Switch, TimePicker } from "antd"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addItemModalOpened, selectAddItemModalStatus } from "./SchedulerSlice"


const itemTypeOptions = [
  { label: 'Task', value: 'task' },
  { label: 'Event', value: 'event' },
  { label: 'Reminder', value: 'reminder' },
  { label: 'To-do List', value: 'todoList' },
  { label: 'Goal', value: 'goal' },
  { label: 'Birthday', value: 'birthday' }
]

export const AddItemModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const addItemModalStatus = useAppSelector(selectAddItemModalStatus)

  return (
    <Modal
      title='Add Activity'
      open={addItemModalStatus}
      onCancel={() => dispatch(addItemModalOpened(false))}
      destroyOnHidden
    >
      <Form >
        <Form.Item name='title' required>
          <Input placeholder="Title" />
        </Form.Item>

        <Form.Item name='date' required>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name='description'>
          <Input.TextArea placeholder="Description" autoSize={{ minRows: 3, maxRows: 3 }} />
        </Form.Item>

        <Form.Item name='itemTypes' required>
          <Select options={itemTypeOptions} />
        </Form.Item>

        <Form.Item name='colorPicker'>
          <ColorPicker />
        </Form.Item>

        <Form.Item name='allDay'>
          <Switch
            checkedChildren="All Day"
            unCheckedChildren="Custom Time"
            defaultChecked={false}
          />
        </Form.Item>

        <Form.Item name="timeRange">
          <TimePicker.RangePicker format="HH:mm" />
        </Form.Item>

        <Form.Item name="remindAt">
          <TimePicker format="HH:mm" placeholder='Remind at' />
        </Form.Item>

        <Form.Item name="todoItems">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add to-do items by pressing Enter"
            tokenSeparators={[',']}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
} 