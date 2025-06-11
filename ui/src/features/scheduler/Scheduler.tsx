import { Button, Calendar, CalendarProps, Flex, notification, Select, Space, Tag } from "antd"
import type { Dayjs } from 'dayjs'
import dayjs from "dayjs"
import '../../../public/CustomCalendar.css'
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addItemModalOpened,
  insertingItemStatusChanged,
  itemModalItemSet,
  itemModalOpened,
  itemsSelectors,
  selectInsertingItemState
} from "./SchedulerSlice"
import { AddItemModal } from "./AddItemModal"
import { useEffect } from "react"
import { ItemEntity } from "./SchedulerAPI"
import { ItemModal } from "./ItemModal"


const { Option } = Select

export const Scheduler: React.FC = () => {
  const dispatch = useAppDispatch()

  const allItems = useAppSelector(itemsSelectors.selectAll)
  const insertingItems = useAppSelector(selectInsertingItemState)

  const [api, contextHolder] = notification.useNotification()

  const onItemOpen = (item: ItemEntity) => {
    dispatch(itemModalItemSet(item))
    dispatch(itemModalOpened(true))
  }

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
          onClick={() => { onItemOpen(item) }}
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
    <Flex vertical align='center' gap={20} style={{ width: '100%', height: '100vh' }} >
      {contextHolder}

      <AddItemModal />
      <ItemModal />

      <Space wrap>
        <Select placeholder="Select option" style={{ width: 200 }}>
          <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
        </Select>

        <Button onClick={() => dispatch(addItemModalOpened(true))}>Add Item</Button>
      </Space>

      <Flex
        justify="center"
        style={{
          width: '80vw',
          height: '80%',
          overflow: 'auto',
          padding: 16,
          background: 'white',
          borderRadius: 8
        }}>
        <Calendar
          fullscreen
          style={{ border: '2px solid #f0f0f0' }}
          cellRender={cellRender}
        />
      </Flex>
    </Flex>
  )
}