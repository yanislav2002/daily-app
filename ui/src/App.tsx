import { useState } from 'react'
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
    label: 'Tasks'
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
  const [selectedKey, setSelectedKey] = useState('1')
  const [collapsed, setCollapsed] = useState(false)

  const renderContent = (key: string) => {
    switch (key) {
      case '1':
        return <div>Content for Navigation One</div>
      case '2':
        return <div>Content for Navigation Two</div>
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
          <Image src='../public/logo.png' width='80px' preview={false} />
        </Space>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => { setSelectedKey(e.key) }}
          items={items}
        />
      </Sider>
      <Content style={{ padding: '24px', backgroundColor: '#1e1e1e', color: 'white', flex: 1 }}>
        {renderContent(selectedKey)}
      </Content>
    </Layout>
  )
}

export default App
