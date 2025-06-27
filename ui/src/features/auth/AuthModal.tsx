import { Button, Flex, Form, Input, Modal, Select } from 'antd'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { authModalOpened, authModeStatusChanched, loginAsync, registerAsync, selectAuthModal } from './AuthSlice'
import countries from 'world-countries'
import { LoginParams, RegisterParams } from './AuthApi'


type FormValues = {
  username: string
  password: string
  repeatPassword: string
  mail: string
  countryCode: string | undefined
}

const initalValues: FormValues = {
  username: '',
  password: '',
  repeatPassword: '',
  mail: '',
  countryCode: undefined
}

const countryOptions = countries.map((country) => ({
  label: country.name.common,
  value: country.cca2
}))

const formValuesToLoginParams = (values: FormValues): LoginParams => {
  return {
    mail: values.mail,
    password: values.password
  }
}

const formValuesToRegisterParams = (values: FormValues): RegisterParams => {
  return {
    mail: values.mail,
    password: values.password,
    username: values.username,
    countryCode: values.countryCode ?? ''
  }
}

export const AuthModal: React.FC = () => {
  const dispatch = useAppDispatch()

  const { open, authMode } = useAppSelector(selectAuthModal)

  const [form] = Form.useForm<FormValues>()

  const isAuthModeLogin = authMode === 'login'

  const resetFormAndState = () => {
    form.resetFields()
  }

  const onFinish = async (values: FormValues) => {
    if (isAuthModeLogin) {
      const loginParams = formValuesToLoginParams(values)
      await dispatch(loginAsync(loginParams))
    } else {
      const registerParams = formValuesToRegisterParams(values)
      await dispatch(registerAsync(registerParams))
    }
  }

  const onModalCancel = () => {
    dispatch(authModalOpened(false))
    resetFormAndState()
  }

  const onModalSubmit = async () => {
    try {
      await form.validateFields()

      form.submit()
      setTimeout(() => {
        resetFormAndState()
      }, 200)
    } catch {
      return
    }
  }

  return (
    <Modal
      title={isAuthModeLogin ? 'Login' : 'Register'}
      open={open}
      onCancel={onModalCancel}
      onOk={onModalSubmit}
    >
      <Flex vertical style={{ marginTop: '30px' }}>
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={initalValues}
          validateTrigger={['onChange', 'onSubmit']}
          layout='vertical'
        >
          <Form.Item
            name='username'
            hidden={isAuthModeLogin}
            validateDebounce={500}
            rules={[
              { required: !isAuthModeLogin, message: 'Please enter username!' },
              { min: 3, max: 30 }
            ]}
          >
            <Input placeholder='Username' />
          </Form.Item>

          <Form.Item
            name='mail'
            rules={[
              { required: true, message: 'Please enter mail!' },
              {
                validator: (_, value: string) => {
                  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

                  if (!value || emailRegex.test(value)) {
                    return Promise.resolve()
                  }

                  return Promise.reject(new Error('Please enter a valid email!'))
                }
              }
            ]}
          >
            <Input placeholder='Mail' />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[
              { required: true, message: 'Please enter password!' },
              {
                validator: (_, value: string) => {
                  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

                  if (!value || passwordRegex.test(value)) {
                    return Promise.resolve()
                  }

                  return Promise.reject(
                    new Error('Password must be at least 6 characters, include letters and numbers.')
                  )
                }
              }
            ]}
          >
            <Input.Password placeholder='Password' />
          </Form.Item>

          <Form.Item
            name='repeatPassword'
            hidden={isAuthModeLogin}
            dependencies={['password']}
            rules={[
              { required: !isAuthModeLogin, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }

                  return Promise.reject(new Error('Passwords do not match!'))
                }
              })
            ]}
          >
            <Input.Password placeholder='Repeat password' />
          </Form.Item>

          <Form.Item
            name='countryCode'
            hidden={isAuthModeLogin}
            rules={[{ required: !isAuthModeLogin, message: 'Please select your country!' }]}
          >
            <Select
              showSearch
              placeholder='Select your country or search by country code'
              options={countryOptions}
            />

          </Form.Item>

        </Form>

        <Button type='link' onClick={() => dispatch(authModeStatusChanched(isAuthModeLogin ? 'register' : 'login'))}>
          {isAuthModeLogin ? 'You don\'t have account? Register now!' : 'Already have an account? Sign in!'}
        </Button>

      </Flex>

    </Modal>
  )
}