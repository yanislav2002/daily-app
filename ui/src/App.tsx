import { useEffect, useState } from 'react'
import './App.css'
import { Menu, Layout, Space, Image } from 'antd'
import {
  AreaChartOutlined,
  CalendarOutlined,
  FormOutlined,
  HomeOutlined,
  LoginOutlined,
  MessageOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Scheduler } from './features/scheduler/Scheduler'
import { fetchCategoriesAsync, fetchItemsAsync } from './features/scheduler/SchedulerSlice'
import { useAppDispatch } from './app/hooks'


const { Sider, Content } = Layout

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
    key: '4',
    icon: <AreaChartOutlined />,
    label: 'Statistics'
  },
  {
    key: '5',
    icon: <LoginOutlined />,
    label: 'Login'
  },
  {
    key: '6',
    icon: <SettingOutlined />,
    label: 'Settings'
  },
  {
    key: '7',
    icon: <MessageOutlined />,
    label: 'Feedback'
  }
]

const App = () => {
  const dispatch = useAppDispatch()

  const [selectedKey, setSelectedKey] = useState('1') //todo remove useState
  const [collapsed, setCollapsed] = useState(false) //todo remove useState

  useEffect(() => {
    const onLoad = async () => {
      try {
        await dispatch(fetchItemsAsync())
        await dispatch(fetchCategoriesAsync())
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
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
      >
        <Space >
          <Image src='/logo.png' width='80px' preview={false} />
        </Space>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => { setSelectedKey(e.key) }}
          items={items}
        />
      </Sider>
      <Content style={{
        backgroundColor: '#1e1e1e',
        color: 'white',
        flex: 1,
        height: '100vh',
        overflow: 'auto'
      }}>
        {renderContent(selectedKey)}
      </Content>
    </Layout>
  )
}

export default App
