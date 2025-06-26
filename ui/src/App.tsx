import { useEffect } from 'react'
import './App.css'
import { Menu, Layout, Space, Image, Button, Flex, Tooltip } from 'antd'
import {
  CalendarOutlined,
  FormOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MessageOutlined,
  UserAddOutlined
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
import { AuthModal } from './features/auth/AuthModal'
import { authModalOpened, authModeStatusChanched } from './features/auth/AuthSlice'
import { MenuProps } from 'rc-menu'


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

  const onLoginClick = () => {
    dispatch(authModeStatusChanched('login'))
    dispatch(authModalOpened(true))
  }

  const onRegisterClick = () => {
    dispatch(authModeStatusChanched('register'))
    dispatch(authModalOpened(true))
  }

  const renderContent = (key: string) => {
    switch (key) {
      case '1':
        return <div>Content for Navigation One</div>
      case '2':
        return <Scheduler />
      case '3':
        return <div>Content for Option 3</div>
      default:
        return
    }
  }

  const renderLinks = () => {
    return (
      <Flex vertical style={{ marginBottom: '10px' }}>
        <Button
          type="link"
          icon={
            siderCollapsed
              ? <Tooltip title='Login' arrow placement='right'><LoginOutlined /></Tooltip>
              : <LoginOutlined />
          }
          onClick={onLoginClick}
          style={{ ...buttonStyle, width: '100%', textAlign: 'left' }}
        >
          {!siderCollapsed && 'Login'}
        </Button>

        <Button
          type="link"
          icon={
            siderCollapsed
              ? <Tooltip title='Login' arrow placement='right'><UserAddOutlined /></Tooltip>
              : <UserAddOutlined />
          }
          onClick={onRegisterClick}
          style={{ ...buttonStyle, width: '100%', textAlign: 'left' }}
        >
          {!siderCollapsed && 'Register'}
        </Button>

        <Button
          type="text"
          icon={
            siderCollapsed
              ? <Tooltip title='Login' arrow placement='right'><LogoutOutlined /></Tooltip>
              : <LogoutOutlined />
          }
          style={buttonStyle}
        >
          {!siderCollapsed && 'Logout'}
        </Button>

        <Button
          type="text"
          icon={
            siderCollapsed
              ? <Tooltip title='Login' arrow placement='right'><MessageOutlined /></Tooltip>
              : <MessageOutlined />
          }
          // onClick={onFeedbackClick}
          style={buttonStyle}
        >
          {!siderCollapsed && 'Feedback'}
        </Button>
      </Flex>
    )
  }

  const buttonStyle: React.CSSProperties = {
    color: 'white',
    width: '100%',
    textAlign: 'left',
    transition: 'background 0.3s',
    backgroundColor: 'transparent'
  }

  return (
    <Layout style={{ height: '100vh', minWidth: '100vw' }}>
      <AuthModal />
      <Sider
        style={{
          backgroundColor: '#33658a',
          height: '100%'
        }}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={(val: boolean) => dispatch(siderCollapseSet(val))}
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
      >
        <Flex vertical justify='space-between' style={{ height: '100%' }}>
          <Flex vertical>
            <Space>
              <Image src='/logo.png' width={siderCollapsed ? ICON_COLLAPSED_WIDTH : ICON_WIDTH} preview={false} />
            </Space>
            <Menu
              mode="inline"
              defaultSelectedKeys={[selectedMenuKey]}
              onClick={(e) => dispatch(menuKeySelected(e.key))}
              items={items}
              motion={{
                motionLeaveImmediately: true
              }}
            />
          </Flex>

          {renderLinks()}
        </Flex>
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
