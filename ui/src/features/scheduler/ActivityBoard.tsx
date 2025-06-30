import { Button, Flex, Table } from "antd"
import { Board } from "../../util/components/Board"
import { useAppSelector } from "../../app/hooks"
import { categoriesSelectors, itemsSelectors, selectLeyout } from "./SchedulerSlice"
import { SIDER_COLLAPSED_WIDTH, SIDER_WIDTH } from "../../App"



export const ActivityBoard: React.FC = () => {
  const { siderCollapsed } = useAppSelector(selectLeyout)

  const allItems = useAppSelector(itemsSelectors.selectAll)
  const categories = useAppSelector(categoriesSelectors.selectAll)

  const PAGE_WIDTH = `calc(100vw-${siderCollapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH})`

  const tasks = allItems.filter(item => item.type === 'task')

  const tasksWithoutCategory = tasks.filter(item => !item.categoryId)

  const tasksByCategory = categories.map(category => ({
    category,
    items: tasks.filter(item => item.categoryId === category.id)
  })).filter(group => group.items.length > 0)

  console.log(tasksByCategory)

  return (
    <Flex gap='2em' vertical justify='center' style={{ width: PAGE_WIDTH, minWidth: '800px', padding: '20px' }}>
      {tasksByCategory.map(({ category, items }) => (
        <Board key={category.id} tasks={items} title={category.name} />
      ))}

      {tasksWithoutCategory.length > 0 && (
        <Board tasks={tasksWithoutCategory} title="Uncategorized" />
      )}
    </Flex>
  )
} 