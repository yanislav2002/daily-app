import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ItemType } from "./SchedulerAPI"


type State = {
  addItemModal: {
    open: boolean
    itemType: ItemType
  }
}

const initialState: State = {
  addItemModal: {
    open: false,
    itemType: 'event'
  }
}

const schedulerSlice = createSlice({
  name: 'scheduler',
  initialState,
  reducers: {
    addItemModalOpened: (state, action: PayloadAction<boolean>) => {
      state.addItemModal.open = action.payload
    },
    modalItemTypeChanged: (state, action: PayloadAction<ItemType>) => {
      state.addItemModal.itemType = action.payload
    }

  }
  // extraReducers(builder) {
  // builder.
  // },
})

export const selectModalState = (state: RootState) => state.scheduler.addItemModal

export const {
  addItemModalOpened,
  modalItemTypeChanged
} = schedulerSlice.actions

export default schedulerSlice.reducer