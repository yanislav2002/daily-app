import { Button, Layout, Typography, Row, Col, Card, Space } from "antd"
import { CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons"
import { authModalOpened, authModeStatusChanched } from "../auth/AuthSlice"
import { useAppDispatch } from "../../app/hooks"

const { Content } = Layout
const { Title, Text } = Typography


export const Home = () => {
  const dispatch = useAppDispatch()

  const onLoginClick = () => {
    dispatch(authModeStatusChanched('login'))
    dispatch(authModalOpened(true))
  }

  const onRegisterClick = () => {
    dispatch(authModeStatusChanched('register'))
    dispatch(authModalOpened(true))
  }

  return (
    <Layout>
      <Content style={{ padding: "3rem 2rem", minHeight: "100vh" }}>
        <Row justify="center" style={{ textAlign: "center" }}>
          <Col xs={24} md={16}>
            <Title>Organize Your Day Smarter</Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Plan tasks, events, and goals — all in one place.
            </Text>
            <br /><br />
            <Space>
              <Button type="primary" size="large" onClick={onRegisterClick}>Sign Up</Button>
              <Button size="large" onClick={onLoginClick}>Log In</Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]} justify="center" style={{ marginTop: "4rem" }}>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ textAlign: "center" }}
              cover={<CalendarOutlined style={{ fontSize: 48, color: "#1890ff", marginTop: 16 }} />}
            >
              <Title level={4}>Calendar</Title>
              <Text>Organize your day with a visual calendar</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ textAlign: "center" }}
              cover={<CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a", marginTop: 16 }} />}
            >
              <Title level={4}>Task Board</Title>
              <Text>Track progress and manage tasks easily</Text>
            </Card>
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: "4rem", textAlign: "center" }}>
          <Col xs={24} md={16}>
            <Title level={3}>Why Choose Daily Planner?</Title>
            <Space direction="vertical" size="large" style={{ marginTop: "2rem" }}>
              <Space>
                <CheckCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                <Text>Boost your productivity with daily structure</Text>
              </Space>
              <Space>
                <CalendarOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <Text>Visualize tasks and events in a smart calendar</Text>
              </Space>
              <Space>
                <CheckCircleOutlined style={{ fontSize: 24, color: "#faad14" }} />
                <Text>Track goals and progress over time</Text>
              </Space>
            </Space>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}