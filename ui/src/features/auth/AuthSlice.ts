import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { login, LoginParams, register, RegisterParams } from './AuthApi'
import { RootState } from '../../app/store'
import ThunkStatus from '../../util/ThunkStatus'


export type AuthMode = 'login' | 'register'

type State = {
  registeringStatus: ThunkStatus
  loggingInStatus: ThunkStatus
  userId: string | undefined
  modal: {
    authMode: AuthMode
    open: boolean
  }
}

const initialState: State = {
  registeringStatus: { status: 'idle' },
  loggingInStatus: { status: 'idle' },
  userId: undefined,
  modal: {
    open: false,
    authMode: 'register'
  }
}

export const registerAsync = createAsyncThunk(
  'auth/register', async (params: RegisterParams) => {
    return await register(params)
  }
)

export const loginAsync = createAsyncThunk(
  'auth/login', async (params: LoginParams) => {
    await login(params)
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authModeStatusChanched: (state, action: PayloadAction<AuthMode>) => {
      state.modal.authMode = action.payload
    },
    logout: (state) => {
      state.userId = undefined
    },
    registeringStatusReset: (state) => {
      state.registeringStatus = { status: 'idle', error: undefined }
    },
    loggingInStatusReset: (state) => {
      state.loggingInStatus = { status: 'idle', error: undefined }
    },
    authModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modal.open = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(registerAsync.pending, (state) => {
        state.registeringStatus.status = 'loading'
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.registeringStatus.status = 'succeeded'
      })
      .addCase(registerAsync.rejected, (state) => {
        state.registeringStatus.status = 'failed'
        state.userId = undefined
      })
      .addCase(loginAsync.pending, (state) => {
        state.loggingInStatus.status = 'loading'
      })
      .addCase(loginAsync.fulfilled, (state) => {
        state.loggingInStatus.status = 'succeeded'
      })
      .addCase(loginAsync.rejected, (state) => {
        state.loggingInStatus.status = 'failed'
        state.userId = undefined
      })
  }
})

export const selectAuthModal = (state: RootState) => state.auth.modal

export const {
  authModeStatusChanched,
  logout,
  registeringStatusReset,
  loggingInStatusReset,
  authModalOpened
} = authSlice.actions

export default authSlice.reducer
