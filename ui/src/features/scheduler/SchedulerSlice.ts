import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { fetchItems, insertItem, Item, ItemEntity, ItemType } from "./SchedulerAPI"
import ThunkStatus from "../../util/ThunkStatus"


const itemsAdapter = createEntityAdapter<ItemEntity>()

type State = {
  fetchingItems: ThunkStatus
  insertingItem: ThunkStatus
  addItemModal: {
    open: boolean
    fields: {
      itemType: ItemType
      allDay: boolean
    }
  }
  itemModal: {
    open: boolean
    item: ItemEntity | undefined
  }
  itemsAdapter: EntityState<ItemEntity, string>
}

const initialState: State = {
  fetchingItems: { status: "idle" },
  insertingItem: { status: "idle" },
  addItemModal: {
    open: false,
    fields: {
      itemType: 'event',
      allDay: false
    }
  },
  itemModal: {
    open: false,
    item: undefined
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
    },
    insertingItemStatusChanged: (state) => {
      state.insertingItem = { status: 'idle', error: undefined }
    },
    fetchingItemStatusChanged: (state) => {
      state.fetchingItems = { status: 'idle', error: undefined }
    },
    itemModalItemSet: (state, action: PayloadAction<ItemEntity | undefined>) => {
      state.itemModal.item = action.payload
    },
    itemModalOpened: (state, action: PayloadAction<boolean>) => {
      state.itemModal.open = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchItemsAsync.pending, (state) => {
        state.fetchingItems.status = 'loading'
      })
      .addCase(fetchItemsAsync.fulfilled, (state, action) => {
        const items = action.payload

        itemsAdapter.setAll(state.itemsAdapter, items)

        state.fetchingItems.status = 'succeeded'
      })
      .addCase(fetchItemsAsync.rejected, (state) => {
        state.fetchingItems.status = 'failed'
        state.fetchingItems.error = '//todo add err'
      })
      .addCase(insertItemAsync.pending, (state) => {
        state.insertingItem.status = 'loading'
      })
      .addCase(insertItemAsync.fulfilled, (state, action) => {
        const itemEntity = action.payload

        itemsAdapter.setOne(state.itemsAdapter, itemEntity)

        state.addItemModal.open = false
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
export const selectItemModalState = (state: RootState) => state.scheduler.itemModal
export const selectInsertingItemState = (state: RootState) => state.scheduler.insertingItem

export const itemsSelectors = itemsAdapter.getSelectors((state: RootState) => state.scheduler.itemsAdapter)

export const {
  addItemModalOpened,
  modalItemTypeChanged,
  formFieldAllDaySwitched,
  insertingItemStatusChanged,
  fetchingItemStatusChanged,
  itemModalItemSet,
  itemModalOpened
} = schedulerSlice.actions

export default schedulerSlice.reducer