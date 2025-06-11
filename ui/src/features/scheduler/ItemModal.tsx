import { Divider, Flex, Modal, Tag, Typography } from "antd"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { itemModalOpened, selectItemModalState } from "./SchedulerSlice"


const { Text, Paragraph, Title } = Typography

export const ItemModal: React.FC = () => {
  const dispatch = useAppDispatch()

  const { open, item } = useAppSelector(selectItemModalState)

  const onModalCancel = () => {
    dispatch(itemModalOpened(false))
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

  return (
    item &&
    <Modal
      title={renderModalTitle(item.color, item.title)}
      open={open}
      onCancel={onModalCancel}
    >
      <Flex vertical>
        <Text type='secondary'>{item.date}</Text>
        <Paragraph>{item.description}</Paragraph>
        <Divider />

      </Flex>

    </Modal>
  )
}
