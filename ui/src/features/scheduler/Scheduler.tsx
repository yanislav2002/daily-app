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
  categoryModalOpened,
  selectInsertingItemState,
  selectInsertingCategoryState,
  insertingCategoryStatusChanged
} from "./SchedulerSlice"
import { AddItemModal } from "./AddItemModal"
import { useEffect } from "react"
import { ItemEntity, ItemType } from "./SchedulerAPI"
import { ItemModal } from "./ItemModal"
import { CategoryModal } from "./CategoryModal"


const { Option } = Select

export const Scheduler: React.FC = () => {
  const dispatch = useAppDispatch()

  const allItems = useAppSelector(itemsSelectors.selectAll)
  const insertingItems = useAppSelector(selectInsertingItemState)
  const insertingCategory = useAppSelector(selectInsertingCategoryState)

  const [api, contextHolder] = notification.useNotification()

  const getTagStyleByType = (type: ItemType): React.CSSProperties => {
    switch (type) {
      case 'task':
        return {
          fontStyle: 'italic',
          borderRadius: 6,
          border: '2px dashed currentColor'
        }
      case 'event':
        return {
          fontWeight: 'bold'
        }
      case 'reminder':
        return {
          borderRadius: 20
        }
      default:
        return {}
    }
  }

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

    if (insertingCategory.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Category created successfully!',
        duration: 3,
        showProgress: true
      })
      dispatch(insertingCategoryStatusChanged())
    } else if (insertingCategory.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'Failed to create category. Please try again.',
        duration: 3,
        showProgress: true
      })
      dispatch(insertingCategoryStatusChanged())
    }
  }, [insertingItems.status, api, dispatch, insertingCategory.status])

  const dateCellRender = (value: Dayjs) => {
    const itemsForDay = allItems.filter(item =>
      dayjs(item.date, 'DD-MM-YYYY').isSame(value, 'day')
    )

    return (
      itemsForDay.map((item) => (
        <Tag
          style={{
            width: '100%',
            margin: 2,
            alignSelf: 'center',
            cursor: 'pointer',
            ...getTagStyleByType(item.type)
          }}
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
    <Flex vertical align='center' gap={20} style={{ width: '100%', height: '100vh', padding: '20px' }} >
      {contextHolder}

      <AddItemModal />
      <ItemModal />
      <CategoryModal />

      <Space wrap>
        <Select placeholder="Select option" style={{ width: 200 }}>
          <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
        </Select>

        <Button onClick={() => dispatch(addItemModalOpened(true))}>Add Item</Button>

        <Button >Add Tasks</Button>

        <Button onClick={() => dispatch(categoryModalOpened(true))}>Create Category</Button>
      </Space>

      <Flex
        justify="center"
        style={{
          width: '80vw',
          height: '85vh',
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