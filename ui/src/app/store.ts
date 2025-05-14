import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import schedulerReducer from '../features/scheduler/SchedulerSlice'


export const store = configureStore({
  reducer: {
    scheduler: schedulerReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>
