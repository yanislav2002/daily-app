import React from 'react'
import { Typography, Card, Flex } from 'antd'
import { isEventDetails, isTaskDetails, ItemEntity } from '../../features/scheduler/SchedulerAPI'
import { useAppDispatch } from '../../app/hooks'
import { itemModalItemSet, itemModalOpened } from '../../features/scheduler/SchedulerSlice'


const { Text } = Typography

type CalendarItem = {
  id: string
  title: string
  start: string
  end: string
  color?: string
  allDay?: boolean
}

type Props = {
  calendarItems: ItemEntity[] | undefined
}

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const ROW_HEIGHT = 16

export const DayView: React.FC<Props> = ({ calendarItems }) => {
  const dispatch = useAppDispatch()

  if (!calendarItems) return null

  const allDayEvents = calendarItems.filter(i => i.allDay)
  const timedItems = calendarItems.filter(i => !i.allDay)

  const onItemOpen = (item: ItemEntity) => {
    dispatch(itemModalItemSet(item))
    dispatch(itemModalOpened(true))
  }

  const renderCardItems = (items: ItemEntity[]) => {
    return items.map(event => {
      if (isTaskDetails(event.details) || isEventDetails(event.details)) {

        const startMin = timeToMinutes(event.details.startTime)
        const endMin = timeToMinutes(event.details.endTime)
        const top = (startMin / 15) * ROW_HEIGHT
        const height = ((endMin - startMin) / 15) * ROW_HEIGHT

        return (
          <Card
            key={event.id}
            size="small"
            styles={{
              body: {
                padding: '5px 5px 5px 10px'
              }
            }}
            style={{
              padding: 0,
              position: 'absolute',
              top,
              left: 8,
              right: 8,
              height,
              backgroundColor: event.color ?? '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer'
            }}
            onClick={() => { onItemOpen(event) }}
          >
            {height >= 32 && <Flex gap='5px'>
              <Text style={{ color: '#fff' }} strong > {event.title}</Text>
              <Text style={{ color: '#fff' }}>
                {`(${event.details.startTime ?? 'All Day'}-${event.details.endTime ?? ''})`}
              </Text>
            </Flex>
            }
          </Card>
        )
      }

      return null
    })
  }

  return (
    <Flex vertical style={{ minHeight: '100%', width: '100%', paddingLeft: '10px' }}>

      {/* {allDayEvents.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <Title level={5}>All-Day Events</Title>
          {allDayEvents.map(item => (
            <Tag key={item.id} color={item.color}>{item.title}</Tag>
          ))}
        </Card>
      )} */}

      <div
        style={{
          position: 'relative', display: 'flex', borderTop: '1px solid #ddd'
        }}
      >
        <div style={{ width: 30 }}>
          {Array.from({ length: 96 }).map((_, i) => {
            const hour = Math.floor(i / 4)
            const minute = (i % 4) * 15
            const label = minute === 0 ? `${hour.toString().padStart(2, '0')}:00` : ''
            return (
              <div
                key={i}
                style={{
                  height: ROW_HEIGHT,
                  borderBottom: '1px dashed #eee',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  paddingRight: 8,
                  fontSize: 12,
                  color: '#666'
                }}
              >
                {label}
              </div>
            )
          })}
        </div>

        {/* Timeline Grid */}
        <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid #ddd' }}>
          {Array.from({ length: 96 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: ROW_HEIGHT,
                borderBottom: '1px dashed #eee'
              }}
            />
          ))}

          {renderCardItems(calendarItems)}

        </div>
      </div>
    </Flex>
  )
}
