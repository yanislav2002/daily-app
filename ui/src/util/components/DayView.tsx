import React from 'react'
import { Typography, Card, Flex, Tag } from 'antd'
import { isEventDetails, isTaskDetails, ItemEntity } from '../../features/scheduler/SchedulerAPI'
import { useAppDispatch } from '../../app/hooks'
import { itemModalItemSet, itemModalOpened } from '../../features/scheduler/SchedulerSlice'


const { Text } = Typography

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

  const allDayEvents = calendarItems.filter(i => (isEventDetails(i.details) && i.details.allDay))

  const onItemOpen = (item: ItemEntity) => {
    dispatch(itemModalItemSet(item))
    dispatch(itemModalOpened(true))
  }

  const renderCardItems = (items: ItemEntity[]) => {
    return items.map(event => {
      if (isEventDetails(event.details) && event.details.allDay) return null
      
      if (isEventDetails(event.details) || isTaskDetails(event.details)) {
        const startMin = typeof event.details.startTime === 'string' ? timeToMinutes(event.details.startTime) : 0
        const endMin = typeof event.details.endTime === 'string' ? timeToMinutes(event.details.endTime) : startMin + 15
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
    <Flex vertical style={{ minHeight: '100%', width: '100%', paddingLeft: '5px' }}>
      {allDayEvents.length > 0 && (
        <Card size="small">
          <Text strong>All-Day Events</Text>
          <Flex wrap="wrap" gap="small" style={{ marginTop: 8 }}>
            {allDayEvents.map(item => (
              <Tag
                key={item.id}
                color={item.color}
                onClick={() => { onItemOpen(item) }}
                style={{ cursor: 'pointer' }}
              >
                {item.title}
              </Tag>
            ))}
          </Flex>
        </Card>
      )}

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
