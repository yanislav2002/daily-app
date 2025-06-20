import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import {
  Category,
  CategoryEntity,
  fetchCategories,
  fetchItems,
  insertCategory,
  insertItem,
  isTaskDetails,
  Item,
  ItemEntity,
  ItemType,
  TaskStatus,
  TodoList
} from "./SchedulerAPI"
import ThunkStatus from "../../util/ThunkStatus"


const itemsAdapter = createEntityAdapter<ItemEntity>()
const categoriesAdapter = createEntityAdapter<CategoryEntity>()

type State = {
  fetchingItems: ThunkStatus
  insertingItem: ThunkStatus
  fetchingCategories: ThunkStatus
  insertingCategory: ThunkStatus
  addItemModal: {
    open: boolean
    fields: {
      itemType: ItemType
      allDay: boolean
      hasTodoList: boolean
      hasCategory: boolean
    }
  }
  itemModal: {
    open: boolean
    item: ItemEntity | undefined
  }
  categoryModal: {
    open: boolean
  }
  itemsAdapter: EntityState<ItemEntity, string>
  categoriesAdapter: EntityState<CategoryEntity, string>
}

const initialState: State = {
  fetchingItems: { status: "idle" },
  insertingItem: { status: "idle" },
  fetchingCategories: { status: "idle" },
  insertingCategory: { status: "idle" },
  addItemModal: {
    open: false,
    fields: {
      itemType: 'event',
      allDay: false,
      hasTodoList: false,
      hasCategory: false
    }
  },
  itemModal: {
    open: false,
    item: undefined
  },
  categoryModal: {
    open: false
  },
  itemsAdapter: itemsAdapter.getInitialState(),
  categoriesAdapter: categoriesAdapter.getInitialState()
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
    categoryModalOpened: (state, action: PayloadAction<boolean>) => {
      state.categoryModal.open = action.payload
    },
    formFieldAllDaySwitched: (state, action: PayloadAction<boolean>) => {
      state.addItemModal.fields.allDay = action.payload
    },
    formFieldHasTodoListSwitched: (state, action: PayloadAction<boolean>) => {
      state.addItemModal.fields.hasTodoList = action.payload
    },
    formFieldHasCategorySwitched: (state, action: PayloadAction<boolean>) => {
      state.addItemModal.fields.hasCategory = action.payload
    },
    insertingItemStatusChanged: (state) => {
      state.insertingItem = { status: 'idle', error: undefined }
    },
    insertingCategoryStatusChanged: (state) => {
      state.insertingCategory = { status: 'idle', error: undefined }
    },
    fetchingItemStatusChanged: (state) => {
      state.fetchingItems = { status: 'idle', error: undefined }
    },
    itemModalItemSet: (state, action: PayloadAction<ItemEntity | undefined>) => {
      state.itemModal.item = action.payload
    },
    itemModalOpened: (state, action: PayloadAction<boolean>) => {
      state.itemModal.open = action.payload
    },
    itemModalTaskStatusChanged: (state, action: PayloadAction<TaskStatus>) => {
      if (isTaskDetails(state.itemModal.item?.details)) {
        state.itemModal.item.details.status = action.payload
      }
    },
    todoValueChanched: (state, action: PayloadAction<{ key: number, checked: boolean }>) => {
      const updatedTodo = action.payload

      if (isTaskDetails(state.itemModal.item?.details)) {
        const todoList = state.itemModal.item.details.todoList

        if (todoList) {
          const index = todoList.findIndex(todo => todo.key === updatedTodo.key)
          if (index !== -1) {
            todoList[index] = { ...todoList[index], done: updatedTodo.checked }
          }
        }
      }
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

      .addCase(insertCategoryAsync.pending, (state) => {
        state.insertingCategory.status = 'loading'
      })
      .addCase(insertCategoryAsync.fulfilled, (state, action) => {
        const categoryEntity = action.payload

        categoriesAdapter.setOne(state.categoriesAdapter, categoryEntity)

        state.categoryModal.open = false
        state.insertingCategory.status = 'succeeded'
      })
      .addCase(insertCategoryAsync.rejected, (state) => {
        state.insertingCategory.status = 'failed'
        state.insertingCategory.error = '//todo add err'
      })

      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.fetchingCategories.status = 'loading'
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        const categories = action.payload

        categoriesAdapter.addMany(state.categoriesAdapter, categories)

        state.categoryModal.open = false
        state.fetchingCategories.status = 'succeeded'
      })
      .addCase(fetchCategoriesAsync.rejected, (state) => {
        state.fetchingCategories.status = 'failed'
        state.fetchingCategories.error = '//todo add err'
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

export const insertCategoryAsync = createAsyncThunk(
  'calendar/insertCategory',
  async (category: Category) => {
    const userId = 'testUser' //todo use real Id

    return await insertCategory(category, userId)
  }
)

export const fetchCategoriesAsync = createAsyncThunk(
  'calendar/fetchCategories',
  async () => {
    const userId = 'testUser' //todo use real Id

    return await fetchCategories(userId)
  }
)

export const selectModalState = (state: RootState) => state.scheduler.addItemModal
export const selectItemModalState = (state: RootState) => state.scheduler.itemModal
export const selectInsertingItemState = (state: RootState) => state.scheduler.insertingItem
export const selectInsertingCategoryState = (state: RootState) => state.scheduler.insertingCategory
export const selectCategoryModal = (state: RootState) => state.scheduler.categoryModal

export const itemsSelectors = itemsAdapter.getSelectors(
  (state: RootState) => state.scheduler.itemsAdapter
)

export const categoriesSelectors = categoriesAdapter.getSelectors(
  (state: RootState) => state.scheduler.categoriesAdapter
)

export const {
  addItemModalOpened,
  modalItemTypeChanged,
  formFieldAllDaySwitched,
  insertingItemStatusChanged,
  fetchingItemStatusChanged,
  itemModalItemSet,
  itemModalOpened,
  formFieldHasTodoListSwitched,
  categoryModalOpened,
  formFieldHasCategorySwitched,
  insertingCategoryStatusChanged,
  itemModalTaskStatusChanged,
  todoValueChanched
} = schedulerSlice.actions

export default schedulerSlice.reducer