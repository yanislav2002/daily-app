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
  filtersUpdated,
  selectLeyout,
  calendarSelectedDateSet,
  selectSelectedCalendarDate
} from "./SchedulerSlice"
import { AddItemModal } from "./AddItemModal"
import { useEffect, useRef } from "react"
import { isTaskDetails, ItemEntity, ItemType } from "./SchedulerAPI"
import { ItemModal } from "./ItemModal"
import { CategoryModal } from "./CategoryModal"
import { DayView } from "../../util/components/DayView"
import { SIDER_COLLAPSED_WIDTH, SIDER_WIDTH } from "../../App"
import { statusIcons } from "../../util/ItemsRecords"
import Title from "antd/es/typography/Title"


export const Scheduler: React.FC = () => {
  const dispatch = useAppDispatch()

  const { siderCollapsed } = useAppSelector(selectLeyout)

  const PAGE_WIDTH = `calc(100vw-${siderCollapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH})`

  const allItems = useAppSelector(itemsSelectors.selectAll)
  const filters = useAppSelector(filtersSelectors.selectAll)

  const insertingItems = useAppSelector(selectInsertingItemState)
  const insertingCategory = useAppSelector(selectInsertingCategoryState)
  const deletingItem = useAppSelector(selectDeletingItemState)
  const updatingItem = useAppSelector(selectUpdatingItemState)
  const { date } = useAppSelector(selectSelectedCalendarDate)

  const formattedDay = dayjs(date, 'DD-MM-YYYY').format('dddd, D MMMM YYYY')

  const currentDateItems = allItems.filter(item => item.date === date)

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

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      const scrollToHour = 8
      const scrollTop = (scrollToHour * 60 / 15) * 16
      el.scrollTop = scrollTop
    }
  }, [])

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

  const onDateSelect = (date: Dayjs) => {
    const formattedDate = dayjs(date).format('DD-MM-YYYY')

    dispatch(calendarSelectedDateSet({ date: formattedDate }))
  }

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
          <Flex justify="space-between">
            {item.title}
            {isTaskDetails(item.details) ? statusIcons[item.details.status] : null}
          </Flex>
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
    <Flex vertical align='center' gap={20} style={{ width: PAGE_WIDTH, height: '100vh', padding: '20px' }} >
      {contextHolder}

      <AddItemModal />
      <ItemModal />
      <CategoryModal />

      <Splitter style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
        <Splitter.Panel
          defaultSize="80%" min="70%" max="80%"
          style={{ overflow: 'hidden' }}
        >
          <Flex
            vertical
            style={{
              height: '100%',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.71)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)'
            }}
          >
            <Flex gap='10px' style={{ height: '40px', width: '100%' }}>
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
              />

              <Button type='primary' onClick={() => dispatch(addItemModalOpened(true))}>Add Activity</Button>


              <Button type='primary' onClick={() => dispatch(categoryModalOpened(true))}>Create Category</Button>
            </Flex>

            <Flex style={{ height: 'calc(100% - 40px)', width: '100%', overflow: 'auto' }}>
              <Calendar
                style={{ border: '2px solid #f0f0f0' }}
                cellRender={cellRender}
                onSelect={onDateSelect}
              />
            </Flex>

          </Flex>

        </Splitter.Panel>

        <Splitter.Panel
          collapsible
          defaultSize="20%" min="15%" max="30%"
          style={{ overflow: 'hidden' }}
        >
          <Flex
            ref={scrollRef}
            style={{
              overflowY: 'auto',
              height: '100%',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.71)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)'
            }}
          >
            <Flex vertical style={{ height: '40px', width: '100%' }}>
              <Title  level={4} style={{ marginBottom: 12 }}>{formattedDay}</Title>

              <DayView calendarItems={currentDateItems} />
            </Flex>
          </Flex>
        </Splitter.Panel>
      </Splitter>
    </Flex >
  )
}