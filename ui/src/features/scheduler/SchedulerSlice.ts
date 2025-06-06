import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { fetchItems, insertItem, Item, ItemEntity, ItemType } from "./SchedulerAPI"
import ThunkStatus from "../../util/ThunkStatus"


const itemsAdapter = createEntityAdapter<ItemEntity>()

type State = {
  insertingItem: ThunkStatus
  addItemModal: {
    open: boolean
    fields: {
      itemType: ItemType
      allDay: boolean
    }
  }
  itemsAdapter: EntityState<ItemEntity, string>
}

const initialState: State = {
  insertingItem: { status: "idle" },
  addItemModal: {
    open: false,
    fields: {
      itemType: 'event',
      allDay: false
    }
  },
  itemsAdapter: itemsAdapter.getInitialState()
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
  },
  extraReducers(builder) {
    builder
      .addCase(insertItemAsync.pending, (state) => {
        state.insertingItem.status = 'loading'
      })
      .addCase(insertItemAsync.fulfilled, (state, action) => {
        const itemEntity = action.payload
        console.log(itemEntity)

        itemsAdapter.setOne(state.itemsAdapter, itemEntity)

        state.insertingItem.status = 'succeeded'
      })
      .addCase(insertItemAsync.rejected, (state) => {
        state.insertingItem.status = 'failed'
        state.insertingItem.error = '//todo add err'
      })
  }
})

export const insertItemAsync = createAsyncThunk(
  'calendar/insertItem',
  async (item: Item) => {
    const userId = 'testUser' //todo use real Id

    return await insertItem(item, userId)
  }
)

export const fetchItemsAsync = createAsyncThunk(
  'calendar/fetchItems',
  async () => {
    const userId = 'testUser' //todo use real Id
    
    return await fetchItems(userId)
  }
)

export const selectModalState = (state: RootState) => state.scheduler.addItemModal

export const itemsSelectors = itemsAdapter.getSelectors((state: RootState) => state.scheduler.itemsAdapter)

export const {
  addItemModalOpened,
  modalItemTypeChanged,
  formFieldAllDaySwitched
} = schedulerSlice.actions

export default schedulerSlice.reducer