import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"


type State = {
  addItemModal: {
    open: boolean
  }
}

const initialState: State = {
  addItemModal: {
    open: false
  }
}

const schedulerSlice = createSlice({
  name: 'scheduler',
  initialState,
  reducers: {
    addItemModalOpened: (state, action: PayloadAction<boolean>) => {
      state.addItemModal.open = action.payload
    }
  }
  // extraReducers(builder) {
  // builder.
  // },
})

export const selectAddItemModalStatus = (state: RootState) => state.scheduler.addItemModal.open

export const { addItemModalOpened } = schedulerSlice.actions
export default schedulerSlice.reducer