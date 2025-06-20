import { Button, Divider, Flex, Modal, Select, Tag, Typography } from "antd"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addItemModalOpened,
  categoriesSelectors,
  deleteItemAsync,
  editingItemSet,
  itemModalItemSet,
  itemModalOpened,
  itemModalTaskStatusChanged,
  selectItemModalState,
  todoValueChanched,
  updateItemAsync
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

  const onModalCancel = () => {
    dispatch(itemModalOpened(false))

    setTimeout(() => {
      dispatch(itemModalItemSet(undefined))
    }, 200)
  }

  const onEdit = () => {
    dispatch(editingItemSet(item))
    dispatch(itemModalOpened(false))
    dispatch(itemModalItemSet(undefined))
    dispatch(addItemModalOpened(true))
  }

  const onDelete = async () => {
    if (item) {
      await dispatch(deleteItemAsync(item.id))
    }
  }

  const onDone = async () => {
    if (item && item.type === 'task') {
      await dispatch(updateItemAsync(item))
    }

    dispatch(itemModalOpened(false))
    dispatch(itemModalItemSet(undefined))
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

  const rendarModalFooterOkButtonText = () => {
    if (isTaskDetails(item?.details)) {
      const todoListItems = item.details.todoList

      if (todoListItems && todoListItems.length > 0) {
        const activeTodos = todoListItems.filter((todo) => !todo.done)
        const completedTodos = todoListItems.filter((todo) => todo.done)

        if (todoListItems.length === activeTodos.length) {
          return statusLabels.not_started
        } else if (todoListItems.length === completedTodos.length) {
          return statusLabels.done
        } else {
          return statusLabels.in_progress
        }
      }

      return statusLabels[item.details.status]
    }

    return 'Done'
  }

  const rendarModalFooterOkButtonIcon = () => {
    if (isTaskDetails(item?.details)) {
      const todoListItems = item.details.todoList

      if (todoListItems && todoListItems.length > 0) {
        const activeTodos = todoListItems.filter((todo) => !todo.done)
        const completedTodos = todoListItems.filter((todo) => todo.done)

        if (todoListItems.length === activeTodos.length) {
          return statusIcons.not_started
        } else if (todoListItems.length === completedTodos.length) {
          return statusIcons.done
        } else {
          return statusIcons.in_progress
        }
      }

      return statusIcons[item.details.status]
    }

    return <CheckCircleOutlined />
  }

  const renderModalFooter = () => {
    return (
      <Flex justify='end' gap='8px' style={{ marginTop: '30px' }}>
        <Button key="edit" type="primary" icon={<EditOutlined />} onClick={onEdit}>
          Edit
        </Button>
        <Button key="delete" type="primary" danger icon={<DeleteOutlined />} onClick={onDelete}>
          Delete
        </Button>
        <Button
          key="done"
          icon={rendarModalFooterOkButtonIcon()}
          onClick={onDone}
        >
          {rendarModalFooterOkButtonText()}
        </Button>
      </Flex>
    )
  }

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
            <Text style={{ flex: '1' }}>Priority:</Text>
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
          <Text style={{ flex: '1' }}>Status:</Text>
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
      title={renderModalTitle(item.color ?? 'nocolor', item.title)}
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
