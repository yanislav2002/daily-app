import { Button, Calendar, CalendarProps, Flex, Select, Space, Tag } from "antd"
import type { Dayjs } from 'dayjs'
import dayjs from "dayjs"
import './CustomCalendar.css'
import { useAppDispatch } from "../../app/hooks"
import { addItemModalOpened } from "./SchedulerSlice"
import { AddItemModal } from "./AddItemModal"
import { CalendarItem } from "./SchedulerAPI"


const { Option } = Select

const listOfCalendarItems: CalendarItem[] = [
  {
    id: '1',
    type: 'event',
    title: 'Team Meeting',
    description: 'Monthly sync with the team',
    date: '2025-05-15',
    startTime: '10:00',
    endTime: '11:00',
    color: '#1890ff'
  },
  {
    id: '2',
    type: 'task',
    title: 'Submit Report',
    description: 'Submit quarterly financial report',
    date: '2025-05-16',
    color: '#52c41a'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Take medication',
    date: '2025-05-14',
    remindAt: '08:00',
    color: '#faad14'
  },
  {
    id: '4',
    type: 'event',
    title: 'Dentist Appointment',
    description: 'Routine dental check-up',
    date: '2025-05-14',
    startTime: '14:30',
    endTime: '15:00',
    color: '#eb2f96'
  },
  {
    id: '5',
    type: 'task',
    title: 'Grocery Shopping',
    description: 'Buy ingredients for dinner',
    date: '2025-05-14',
    color: '#13c2c2'
  },
  {
    id: '6',
    type: 'reminder',
    title: 'Stretch break',
    date: '2025-05-14',
    remindAt: '11:00',
    color: '#a0d911'
  }
]

export const Scheduler: React.FC = () => {
  const dispatch = useAppDispatch()

  const dateCellRender = (value: Dayjs) => {
    const itemsForDay = listOfCalendarItems.filter(item =>
      dayjs(item.date).isSame(value, 'day')
    )

    return (
      itemsForDay.map((item) => (
        <Tag
          style={{ width: '100%', margin: 2, alignSelf: 'center', cursor: 'pointer' }}
          key={item.id}
          color={item.color ?? '#000'}
          onClick={() => { console.log(item.title) }}
        >
          {item.title}
        </Tag>
      ))
    )
  }

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') {
      return (
        <Flex
          vertical
          align="center"
          style={{ overflowX: 'hidden' }}
        >
          {dateCellRender(current)}
        </Flex>
      )
    }

    return null
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <AddItemModal />

      <Space wrap>
        <Select placeholder="Select option" style={{ width: 200 }}>
          <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
        </Select>

        <Button onClick={() => dispatch(addItemModalOpened(true))}>Add Item</Button>
      </Space>

      <Space>
        <Calendar
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            overflow: 'hidden'
          }}
          cellRender={cellRender}
        />

      </Space>
    </Space>
  )
}