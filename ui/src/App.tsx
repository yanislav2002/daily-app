import { useEffect } from 'react'
import './App.css'
import { Menu, Layout, Space, Image } from 'antd'
import {
  CalendarOutlined,
  FormOutlined,
  HomeOutlined,
  LoginOutlined,
  MessageOutlined
} from '@ant-design/icons'
import { Scheduler } from './features/scheduler/Scheduler'
import {
  fetchCategoriesAsync,
  fetchItemsAsync,
  filtersInitialSet,
  menuKeySelected,
  selectLeyout,
  siderCollapseSet
} from './features/scheduler/SchedulerSlice'
import { useAppDispatch, useAppSelector } from './app/hooks'


const { Sider, Content } = Layout

export const SIDER_WIDTH = '250px'
export const SIDER_COLLAPSED_WIDTH = '50px'
const ICON_WIDTH = '80px'
const ICON_COLLAPSED_WIDTH = '50px'

const items = [
  {
    key: '1',
    icon: <HomeOutlined />,
    label: 'Home'
  },
  {
    key: '2',
    icon: <CalendarOutlined />,
    label: 'Calendar'
  },
  {
    key: '3',
    icon: <FormOutlined />,
    label: 'Activity Board'
  },
  {
    key: '5',
    icon: <LoginOutlined />,
    label: 'Login'
  },
  {
    key: '7',
    icon: <MessageOutlined />,
    label: 'Feedback'
  }
]

const App = () => {
  const dispatch = useAppDispatch()

  const { siderCollapsed, selectedMenuKey } = useAppSelector(selectLeyout)

  useEffect(() => {
    const onLoad = async () => {
      try {
        await dispatch(fetchItemsAsync())
        await dispatch(fetchCategoriesAsync())
        dispatch(filtersInitialSet())
      } catch (error) {
        console.log('Failed to fetch items', error)
      }
    }

    onLoad().catch((err: unknown) => { console.log(err) })
  }, [dispatch])

  const renderContent = (key: string) => {
    switch (key) {
      case '1':
        return <div>Content for Navigation One</div>
      case '2':
        return <Scheduler />
      case '13':
        return <div>Content for Option 13</div>
      case '14':
        return <div>Content for Option 14</div>
      default:
        return <div>Select a menu item</div>
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Sider
        style={{
          backgroundColor: '#33658a'
        }}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={(val: boolean) => dispatch(siderCollapseSet(val))}
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
      >
        <Space>
          <Image src='/logo.png' width={siderCollapsed ? ICON_COLLAPSED_WIDTH : ICON_WIDTH} preview={false} />
        </Space>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          onClick={(e) => { dispatch(menuKeySelected(e.key)) }}
          items={items}
        />
      </Sider>
      <Content style={{
        background: 'radial-gradient(circle, #ffffff, #f9f9f9, #f4f4f4, #eeeeee, #e9e9e9)',
        flex: 1,
        height: '100vh',
        overflow: 'auto'
      }}>
        {renderContent(selectedMenuKey)}
      </Content>
    </Layout>
  )
}

export default App
