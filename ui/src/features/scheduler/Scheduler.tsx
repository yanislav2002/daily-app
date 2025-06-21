import { Button, Calendar, CalendarProps, Flex, notification, Select, Splitter, Tag } from "antd"
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
  insertingCategoryStatusChanged,
  selectDeletingItemState,
  deletingItemStatusChanged,
  selectUpdatingItemState,
  updatingItemStatusChanged,
  filtersSelectors,
  filtersUpdated
} from "./SchedulerSlice"
import { AddItemModal } from "./AddItemModal"
import { useEffect } from "react"
import { ItemEntity, ItemType } from "./SchedulerAPI"
import { ItemModal } from "./ItemModal"
import { CategoryModal } from "./CategoryModal"
import { DayView } from "../../util/components/DayView"


export const Scheduler: React.FC = () => {
  const dispatch = useAppDispatch()

  const allItems = useAppSelector(itemsSelectors.selectAll)
  const filters = useAppSelector(filtersSelectors.selectAll)

  const insertingItems = useAppSelector(selectInsertingItemState)
  const insertingCategory = useAppSelector(selectInsertingCategoryState)
  const deletingItem = useAppSelector(selectDeletingItemState)
  const updatingItem = useAppSelector(selectUpdatingItemState)

  const [api, contextHolder] = notification.useNotification()

  const selectedFilters = filters.filter(filter => filter.isSelected).map(f => f.id)
  const filtersWithItemType = filters.filter(f => f.itemType)
  const filtersWithoutItemType = filters.filter(f => !f.itemType)
  const filterOptions = [
    {
      label: 'Item Types',
      options: filtersWithItemType.map(f => ({
        label: f.label,
        value: f.id
      }))
    },
    {
      label: 'Categories',
      options: filtersWithoutItemType.map(f => ({
        label: f.label,
        value: f.id
      }))
    }
  ]

  const getTagStyleByType = (type: ItemType) => {
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

    if (updatingItem.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Item updated successfully!',
        duration: 3,
        showProgress: true
      })
      dispatch(updatingItemStatusChanged())
    } else if (updatingItem.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'Failed to update item. Please try again.',
        duration: 3,
        showProgress: true
      })
      dispatch(updatingItemStatusChanged())
    }

    if (deletingItem.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Item deleted successfully!',
        duration: 3,
        showProgress: true
      })
      dispatch(deletingItemStatusChanged())
    } else if (deletingItem.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'Failed to delete item. Please try again.',
        duration: 3,
        showProgress: true
      })
      dispatch(deletingItemStatusChanged())
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
  }, [
    insertingItems.status,
    api,
    dispatch,
    insertingCategory.status,
    deletingItem.status,
    updatingItem.status
  ])

  const dateCellRender = (value: Dayjs) => {
    const activeFilterTypes = filters
      .filter(f => f.isSelected)
      .map(f => f.id)

    const itemsForDay = allItems.filter(item =>
      dayjs(item.date, 'DD-MM-YYYY').isSame(value, 'day') &&
      activeFilterTypes.includes(item.type) &&
      (item.categoryId ? activeFilterTypes.includes(item.categoryId) : true)
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

      <Flex gap='10px' style={{ width: '90vw' }}>
        <Select
          placeholder="Filter"
          mode='multiple'
          maxTagCount='responsive'
          allowClear
          style={{ flex: 1 }}
          options={filterOptions}
          value={selectedFilters}
          onChange={(selectedIds) => {
            dispatch(filtersUpdated(selectedIds))
          }}
        >

        </Select>

        <Button onClick={() => dispatch(addItemModalOpened(true))}>Add Activity</Button>

        <Button >Add Tasks</Button>

        <Button onClick={() => dispatch(categoryModalOpened(true))}>Create Category</Button>
      </Flex>

      <Splitter style={{ height: '100vh', overflow: 'hidden', width: '90vw' }}>
        <Splitter.Panel
          defaultSize="80%" min="70%" max="80%"
          style={{
            overflow: 'auto',
            borderRadius: 8
          }}
        >
          <Calendar
            fullscreen
            style={{ border: '2px solid #f0f0f0' }}
            cellRender={cellRender}
          />
        </Splitter.Panel>

        <Splitter.Panel
          collapsible
          defaultSize="20%" min="15%" max="30%"
          style={{
            overflow: 'auto',
            background: 'white'
          }}
        >
          <DayView
            calendarItems={allItems}
          />
        </Splitter.Panel>
      </Splitter>
    </Flex>
  )
}