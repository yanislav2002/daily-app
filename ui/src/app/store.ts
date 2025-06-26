import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import schedulerReducer from '../features/scheduler/SchedulerSlice'
import authReducer from '../features/auth/AuthSlice'


export const store = configureStore({
  reducer: {
    scheduler: schedulerReducer,
    auth: authReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>
