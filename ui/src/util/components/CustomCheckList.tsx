import { Checkbox, CheckboxChangeEvent, Collapse, List } from "antd"
import { Typography } from "antd"


const { Paragraph, Text } = Typography

type TodoList = {
  key: number
  text: string
  done: boolean
};

type Props = {
  todoList?: TodoList[]
  onToggle?: (key: number, checked: boolean) => void
}

export const CustomCheckList: React.FC<Props> = ({ todoList, onToggle }) => {
  if (!todoList || todoList.length === 0) return null

  const activeTodos = todoList.filter((todo) => !todo.done)
  const completedTodos = todoList.filter((todo) => todo.done)

  return (
    <>
      {todoList.length > 0 && (
        <Paragraph style={{ marginBottom: 0 }}>
          {activeTodos.length > 0 && (
            <List
              size="small"
              header='Todo List'
              dataSource={activeTodos}
              style={{ marginTop: 8 }}
              bordered
              renderItem={(todo) => {
                return (
                  <List.Item style={{ padding: '4px 0' }}>
                    <Checkbox
                      checked={todo.done}
                      onChange={(e: CheckboxChangeEvent) => onToggle?.(todo.key, e.target.checked)}
                    >
                      <Text>{todo.text}</Text>
                    </Checkbox>
                  </List.Item>
                )
              }}
            />
          )}

          {completedTodos.length > 0 && (
            <Collapse
              ghost
              size='small'
              style={{
                marginTop: 8,
                background: '#f5f5f5',
                borderRadius: 4
              }}
              items={[
                {
                  key: '1',
                  label: 'Completed Todos',
                  children: (
                    <List
                      size="small"
                      dataSource={completedTodos}
                      renderItem={(todo) => (
                        <List.Item style={{ padding: '4px 0' }}>
                          <Checkbox
                            checked={todo.done}
                            onChange={(e: CheckboxChangeEvent) =>
                              onToggle?.(todo.key, e.target.checked)
                            }
                          >
                            <Text type="secondary" delete>
                              {todo.text}
                            </Text>
                          </Checkbox>
                        </List.Item>
                      )}
                    />
                  )
                }
              ]}
            />
          )}
        </Paragraph>
      )}
    </>
  )
}