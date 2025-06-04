import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { CalendarItem, createItem, ItemType } from "./SchedulerAPI"


//todo add thunk prop and group here the items
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

//todo fix this whole func + add thunk prop
export const insertCalendarItem = createAsyncThunk(
  'calendar/insertItem',
  async (item: CalendarItem) => {

    const result = createItem(item)
    return result

  }
)

export const selectModalState = (state: RootState) => state.scheduler.addItemModal

export const {
  addItemModalOpened,
  modalItemTypeChanged,
  formFieldAllDaySwitched
} = schedulerSlice.actions

export default schedulerSlice.reducer