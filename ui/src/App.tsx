import { useEffect } from 'react'
import './App.css'
import { Menu, Layout, Space, Image, Button, Flex, Tooltip, notification } from 'antd'
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
  deletingItemStatusChanged,
  feedbackModalOpened,
  fetchCategoriesAsync,
  fetchItemsAsync,
  filtersInitialSet,
  insertingCategoryStatusChanged,
  insertingItemStatusChanged,
  menuKeySelected,
  selectDeletingItemState,
  selectInsertingCategoryState,
  selectInsertingItemState,
  selectLeyout,
  selectSendingFeedbackState,
  selectUpdatingItemState,
  sendingFeedbackStatusChanged,
  siderCollapseSet,
  updatingItemStatusChanged
} from './features/scheduler/SchedulerSlice'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { AuthModal } from './features/auth/AuthModal'
import {
  authModalOpened,
  authModeStatusChanched,
  loggingInStatusReset,
  logoutUser,
  registeringStatusReset,
  selectLogginginStatus,
  selectRegisteringStatus,
  selectUserId
} from './features/auth/AuthSlice'
import { ActivityBoard } from './features/scheduler/ActivityBoard'
import { AddItemModal } from './features/scheduler/AddItemModal'
import { ItemModal } from './features/scheduler/ItemModal'
import { CategoryModal } from './features/scheduler/CategoryModal'
import { Home } from './features/home/Home'
import { FeedbackModal } from './features/scheduler/FeedbackModal'


const { Sider, Content } = Layout

export const SIDER_WIDTH = '250px'
export const SIDER_COLLAPSED_WIDTH = '50px'
const ICON_WIDTH = '80px'
const ICON_COLLAPSED_WIDTH = '50px'


const App = () => {
  const dispatch = useAppDispatch()

  const { siderCollapsed, selectedMenuKey } = useAppSelector(selectLeyout)

  const registering = useAppSelector(selectRegisteringStatus)
  const loggingin = useAppSelector(selectLogginginStatus)
  const insertingItems = useAppSelector(selectInsertingItemState)
  const insertingCategory = useAppSelector(selectInsertingCategoryState)
  const deletingItem = useAppSelector(selectDeletingItemState)
  const updatingItem = useAppSelector(selectUpdatingItemState)
  const sendingFeedback = useAppSelector(selectSendingFeedbackState)

  const userId = useAppSelector(selectUserId)

  const [api, contextHolder] = notification.useNotification()

  const items = [
    ...(userId ? [
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
    ] : [
      {
        key: '1',
        icon: <HomeOutlined />,
        label: 'Home'
      }
    ])
  ]

  useEffect(() => {
    if (!userId) {
      dispatch(menuKeySelected('1'))
    }
  }, [userId, dispatch])

  useEffect(() => {
    const onLoad = async () => {
      try {
        if (userId) {
          await dispatch(fetchCategoriesAsync())
          await dispatch(fetchItemsAsync())
          dispatch(filtersInitialSet())
        }
      } catch (error) {
        console.log('Failed to fetch items', error)
      }
    }

    onLoad().catch((err: unknown) => { console.log(err) })
  }, [dispatch, userId])

  useEffect(() => {
    if (insertingItems.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Item added successfully!',
        duration: 3,
        showProgress: true
      })
      dispatch(insertingItemStatusChanged())
    } else if (insertingItems.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'Failed to add item. Please try again.',
        duration: 3,
        showProgress: true
      })
      dispatch(insertingItemStatusChanged())
    }

    if (updatingItem.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Item updated successfully!',
        duration: 3,
        showProgress: true
      })
      dispatch(updatingItemStatusChanged())
    } else if (updatingItem.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'Failed to update item. Please try again.',
        duration: 3,
        showProgress: true
      })
      dispatch(updatingItemStatusChanged())
    }

    if (deletingItem.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Item deleted successfully!',
        duration: 3,
        showProgress: true
      })
      dispatch(deletingItemStatusChanged())
    } else if (deletingItem.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'Failed to delete item. Please try again.',
        duration: 3,
        showProgress: true
      })
      dispatch(deletingItemStatusChanged())
    }

    if (insertingCategory.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Category created successfully!',
        duration: 3,
        showProgress: true
      })
      dispatch(insertingCategoryStatusChanged())
    } else if (insertingCategory.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'Failed to create category. Please try again.',
        duration: 3,
        showProgress: true
      })
      dispatch(insertingCategoryStatusChanged())
    }

    if (registering.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Registration Successful',
        duration: 3,
        showProgress: true
      })
      dispatch(registeringStatusReset())
      dispatch(menuKeySelected('1'))
    } else if (registering.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'Registration Failed',
        duration: 3,
        showProgress: true
      })
      dispatch(registeringStatusReset())
    }

    if (loggingin.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Login Successful',
        duration: 3,
        showProgress: true
      })
      dispatch(loggingInStatusReset())
      dispatch(menuKeySelected('1'))
    } else if (loggingin.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'Login Failed',
        duration: 3,
        showProgress: true
      })
      dispatch(loggingInStatusReset())
    }

    if (sendingFeedback.status === 'succeeded') {
      api.success({
        message: 'Success',
        description: 'Your feedback was submitted successfully',
        duration: 3,
        showProgress: true
      })
      dispatch(sendingFeedbackStatusChanged())
    } else if (sendingFeedback.status === 'failed') {
      api.error({
        message: 'Error',
        description: 'We couldn\'t send your feedback. Please try again later',
        duration: 3,
        showProgress: true
      })
      dispatch(sendingFeedbackStatusChanged())
    }
  }, [
    dispatch,
    api,
    deletingItem.status,
    insertingCategory.status,
    insertingItems.status,
    loggingin.status,
    registering.status,
    updatingItem.status,
    sendingFeedback.status
  ])

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
        return <Home />
      case '2':
        return <Scheduler />
      case '3':
        return <ActivityBoard />
      default:
        return
    }
  }

  const renderLinks = () => {
    return (
      <Flex vertical style={{ marginBottom: '10px' }}>
        {!userId && <Button
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
        </Button>}

        {!userId && <Button
          type="link"
          icon={
            siderCollapsed
              ? <Tooltip title='Register' arrow placement='right'><UserAddOutlined /></Tooltip>
              : <UserAddOutlined />
          }
          onClick={onRegisterClick}
          style={{ ...buttonStyle, width: '100%', textAlign: 'left' }}
        >
          {!siderCollapsed && 'Register'}
        </Button>}

        {userId && <Button
          type="text"
          icon={
            siderCollapsed
              ? <Tooltip title='Logout' arrow placement='right'><LogoutOutlined /></Tooltip>
              : <LogoutOutlined />
          }
          style={buttonStyle}
          onClick={() => dispatch(logoutUser())}
        >
          {!siderCollapsed && 'Logout'}
        </Button>}

        {userId && <Button
          type="text"
          icon={
            siderCollapsed
              ? <Tooltip title='Feedback' arrow placement='right'><MessageOutlined /></Tooltip>
              : <MessageOutlined />
          }
          onClick={() => dispatch(feedbackModalOpened(true))}
          style={buttonStyle}
        >
          {!siderCollapsed && 'Feedback'}
        </Button>}
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
      {contextHolder}
      <AuthModal />

      <AddItemModal />
      <ItemModal />
      <CategoryModal />
      <FeedbackModal />

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
