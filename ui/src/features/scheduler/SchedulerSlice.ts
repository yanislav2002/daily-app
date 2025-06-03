import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ItemType } from "./SchedulerAPI"


type State = {
  addItemModal: {
    open: boolean
    fields: {
      itemType: ItemType
      allDay: boolean
    }
  }
}

const initialState: State = {
  addItemModal: {
    open: false,
    fields: {
      itemType: 'event',
      allDay: false
    }
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
      state.addItemModal.fields.itemType = action.payload
    },
    formFieldAllDaySwitched: (state, action: PayloadAction<boolean>) => {
      state.addItemModal.fields.allDay = action.payload
    }
  }
  // extraReducers(builder) {
  // builder.
  // },
})

export const selectModalState = (state: RootState) => state.scheduler.addItemModal

export const {
  addItemModalOpened,
  modalItemTypeChanged,
  formFieldAllDaySwitched
} = schedulerSlice.actions

export default schedulerSlice.reducer