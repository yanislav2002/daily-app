import { Button, Calendar, CalendarProps, Flex, notification, Select, Space, Tag } from "antd"
import type { Dayjs } from 'dayjs'
import dayjs from "dayjs"
import './CustomCalendar.css'
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addItemModalOpened,
  insertingItemStatusChanged,
  itemsSelectors,
  selectInsertingItemState
} from "./SchedulerSlice"
import { AddItemModal } from "./AddItemModal"
import { useEffect } from "react"


const { Option } = Select

export const Scheduler: React.FC = () => {
  const dispatch = useAppDispatch()

  const allItems = useAppSelector(itemsSelectors.selectAll)
  const insertingItems = useAppSelector(selectInsertingItemState)

  const [api, contextHolder] = notification.useNotification()

  useEffect(() => {
    if (insertingItems.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Item added successfully!',
        duration: 3,
        showProgress: true
      })
      dispatch(insertingItemStatusChanged())
    } else if (insertingItems.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'Failed to add item. Please try again.',
        duration: 3,
        showProgress: true
      })
      dispatch(insertingItemStatusChanged())
    }
  }, [insertingItems.status, api, dispatch])

  const dateCellRender = (value: Dayjs) => {
    const itemsForDay = allItems.filter(item =>
      dayjs(item.date, 'DD-MM-YYYY').isSame(value, 'day')
    )

    return (
      itemsForDay.map((item) => (
        <Tag
          style={{ width: '100%', margin: 2, alignSelf: 'center', cursor: 'pointer' }}
          key={item.id}
          color={item.color}
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
    <Space direction="vertical" style={{ width: '100%', height: '100vh' }} size="large">
      {contextHolder}

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
          fullscreen
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