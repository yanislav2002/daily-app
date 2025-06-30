import { Card, Col, Flex, Typography } from 'antd'
import { ItemEntity, TaskDetails, TaskStatus } from '../../features/scheduler/SchedulerAPI'
import { useAppDispatch } from '../../app/hooks'
import { itemModalItemSet, itemModalOpened } from '../../features/scheduler/SchedulerSlice'

const { Title, Text } = Typography


type Props = {
  tasks: ItemEntity[]
  title: string
}

const statusColumns: { status: TaskStatus; title: string }[] = [
  { status: 'not_started', title: 'Not Started' },
  { status: 'waiting', title: 'Waiting' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'canceled', title: 'Canceled' },
  { status: 'done', title: 'Done' }
]

export const Board: React.FC<Props> = ({ tasks, title }) => {
  const dispatch = useAppDispatch()

  const tasksByStatus = statusColumns.reduce((acc, col) => {
    acc[col.status] = tasks.filter(
      (task) => (task.details as TaskDetails).status === col.status
    )
    return acc
  }, {} as Record<TaskStatus, ItemEntity[]>)

  const onItemOpen = (item: ItemEntity) => {
    dispatch(itemModalItemSet(item))
    dispatch(itemModalOpened(true))
  }

  return (
    <Flex
      vertical
      style={{
        height: '100%',
        width: '100%',
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.71)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}
      gap={16}
    >
      <Title level={3} style={{ margin: 0 }}>
        {title}
      </Title>

      <Flex style={{ flex: 1, width: '100%' }}>
        {statusColumns.map(({ status, title }) => (
          <Col
            key={status}
            flex="1 1 20%"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Card
              title={title}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
              styles={{
                body: {
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  overflowY: 'auto'
                }
              }}
            >
              {tasksByStatus[status].map((task, index) => (
                <Card
                  key={index}
                  size="small"
                  style={{
                    borderLeft: `4px solid ${task.color ?? '#1890ff'}`,
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                  onClick={() => { onItemOpen(task) }}
                >
                  <Text strong>{task.title}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {task.date}
                  </Text>
                </Card>
              ))}
            </Card>
          </Col>
        ))}
      </Flex>
    </Flex>
  )
}