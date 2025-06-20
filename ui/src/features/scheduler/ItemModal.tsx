import { Button, Divider, Flex, Modal, Select, Tag, Typography } from "antd"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  categoriesSelectors,
  itemModalItemSet,
  itemModalOpened,
  itemModalTaskStatusChanged,
  selectItemModalState,
  todoValueChanched
} from "./SchedulerSlice"
import {
  EditOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  HourglassOutlined,
  StopOutlined,
  SyncOutlined
} from "@ant-design/icons"
import { isEventDetails, isTaskDetails, TaskStatus } from "./SchedulerAPI"
import { CustomCheckList } from "../../util/components/CustomCheckList"


const { Text, Paragraph, Title } = Typography

const statusLabels: Record<TaskStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  waiting: 'Waiting',
  canceled: 'Canceled',
  done: 'Done'
}

const statusColors: Record<TaskStatus, string> = {
  not_started: 'default',
  in_progress: 'blue',
  waiting: 'orange',
  canceled: 'red',
  done: 'green'
}

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  not_started: <ClockCircleOutlined />,
  in_progress: <SyncOutlined />,
  waiting: <HourglassOutlined />,
  canceled: <StopOutlined />,
  done: <CheckCircleOutlined />
}

const taskStatusOptions = (Object.keys(statusLabels) as TaskStatus[]).map((status) => ({
  label: (
    <Tag color={statusColors[status]} icon={statusIcons[status]} style={{ margin: 0 }}>
      {statusLabels[status]}
    </Tag>
  ),
  value: status
}))


export const ItemModal: React.FC = () => {
  const dispatch = useAppDispatch()

  const { open, item } = useAppSelector(selectItemModalState)
  const categories = useAppSelector(categoriesSelectors.selectAll)

  const category = categories.find(c => c.id === item?.categoryId)

  const onModalCancel = () => { //todo maybe add some waiting 200ms
    dispatch(itemModalOpened(false))
    dispatch(itemModalItemSet(undefined))
  }

  const onEdit = () => {
  }

  const onDelete = () => {

  }
  const onDone = () => {

  }

  const onToggle = (key: number, checked: boolean) => {
    console.log(key, checked)
    dispatch(todoValueChanched({ key, checked }))
  }

  const renderModalTitle = (itemColor: string, itemTitle: string) => {
    return (
      <Flex align='center' gap={8}>
        <Tag color={itemColor} style={{ margin: 0, padding: 0, width: 16, height: 16 }} />
        <Title level={4} style={{ margin: 0 }}>
          {itemTitle}
        </Title>
      </Flex>
    )
  }

  const renderModalFooter = () => (
    <Flex justify='end' gap='8px' style={{ marginTop: '30px' }}>
      <Button key="edit" type="primary" icon={<EditOutlined />} onClick={onEdit}>
        Edit
      </Button>
      <Button key="delete" type="primary" danger icon={<DeleteOutlined />} onClick={onDelete}>
        Delete
      </Button>
      <Button
        key="done"
        icon={
          isTaskDetails(item?.details)
            ? (statusIcons[item.details.status])
            : <CheckCircleOutlined />
        }
        onClick={onDone}
      >
        {isTaskDetails(item?.details)
          ? (statusLabels[item.details.status])
          : 'Done'
        }
      </Button>
    </Flex>
  )

  const renderEventItem = () => {
    if (!isEventDetails(item?.details)) return null

    const showTime = !item.details.allDay && (item.details.startTime ?? item.details.endTime)

    return (
      <Flex vertical gap="small">
        {item.details.allDay ? (
          <Text type="secondary">
            <ClockCircleOutlined style={{ marginRight: 6 }} />
            All day
          </Text>
        ) : (
          showTime && (
            <Text type="secondary">
              <ClockCircleOutlined style={{ marginRight: 6 }} />
              {`${item.details.startTime ?? ""} - ${item.details.endTime ?? ""}`}
            </Text>
          )
        )}
      </Flex>
    )
  }

  const renderTaskItem = () => {
    if (!isTaskDetails(item?.details)) return null

    const {
      priority,
      status,
      deadline,
      todoList,
      estimatedTime,
      startTime,
      endTime
    } = item.details

    return (
      <Flex vertical gap="small">

        <Flex justify='space-between'>
          <Flex justify='space-between' style={{ flex: '1' }}>
            <Text style={{ flex: '1'}}>Priority:</Text>
            <Tag >{priority}</Tag>
          </Flex>

          {(startTime ?? endTime) && (
            <Text type="secondary" style={{ flex: '1', justifySelf: 'end' }}>
              <ClockCircleOutlined style={{ marginRight: 6 }} />
              {startTime}{endTime ? ` – ${endTime}` : ''}
            </Text>
          )}
        </Flex>

        {/* Deadline */}
        {deadline && (
          <Text type="secondary">
            <CalendarOutlined style={{ marginRight: 6 }} />
            Deadline: {deadline}
          </Text>
        )}

        {estimatedTime && (
          <Text type="secondary">
            <HourglassOutlined style={{ marginRight: 6 }} />
            Estimated time: {estimatedTime} min
          </Text>
        )}

        <Divider style={{ marginTop: '8px' }} />

        <Flex>
          <Text style={{ flex: '1'}}>Status:</Text>
          <Select
            style={{ flex: '1' }}
            placeholder="Select status"
            options={taskStatusOptions}
            value={status}
            onChange={(status: TaskStatus) => dispatch(itemModalTaskStatusChanged(status))}
          />
        </Flex>

        <CustomCheckList todoList={todoList} onToggle={onToggle} />

      </Flex>
    )
  }

  return (
    item &&
    <Modal
      title={renderModalTitle(item.color, item.title)}
      open={open}
      onCancel={onModalCancel}
      footer={renderModalFooter}
    >
      <Flex vertical>
        <Text type='secondary'>{item.date}</Text>
        <Paragraph>{item.description}</Paragraph>

        {category && (
          <Text type="secondary">
            <FolderOpenOutlined style={{ marginRight: 6 }} />
            Category: {category.name}
          </Text>
        )}

        <Divider style={{ marginTop: '0px' }} />

        {renderEventItem()}
        {renderTaskItem()}

      </Flex>

    </Modal>
  )
}
