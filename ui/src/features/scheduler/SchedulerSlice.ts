import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import {
  Category,
  CategoryEntity,
  deleteItem,
  FeedbackParams,
  fetchCategories,
  fetchItems,
  insertCategory,
  insertItem,
  isTaskDetails,
  Item,
  ItemEntity,
  ItemType,
  submitFeedback,
  TaskStatus,
  updateItem
} from "./SchedulerAPI"
import ThunkStatus from "../../util/ThunkStatus"
import { logoutUser } from "../auth/AuthSlice"


const itemsAdapter = createEntityAdapter<ItemEntity>()
const categoriesAdapter = createEntityAdapter<CategoryEntity>()
const filtersAdapter = createEntityAdapter<FilterOption>()

type FilterOption = {
  id: string
  label: string
  isSelected: boolean
  itemType?: ItemType
}

type State = {
  fetchingItems: ThunkStatus
  insertingItem: ThunkStatus
  updatingItem: ThunkStatus
  deletingItem: ThunkStatus
  fetchingCategories: ThunkStatus
  insertingCategory: ThunkStatus
  sendingFeedback: ThunkStatus
  addItemModal: {
    open: boolean
    editingItem: ItemEntity | undefined
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
  layout: {
    siderCollapsed: boolean
    selectedMenuKey: string
  }
  calendarSelectedDate: {
    date: string | undefined
  }
  filtersAdapter: EntityState<FilterOption, string>
  itemsAdapter: EntityState<ItemEntity, string>
  categoriesAdapter: EntityState<CategoryEntity, string>
  feedbackModalOpen: boolean
}

const initialState: State = {
  fetchingItems: { status: "idle" },
  insertingItem: { status: "idle" },
  updatingItem: { status: "idle" },
  deletingItem: { status: "idle" },
  fetchingCategories: { status: "idle" },
  insertingCategory: { status: "idle" },
  sendingFeedback: { status: "idle" },
  addItemModal: {
    open: false,
    editingItem: undefined,
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
  calendarSelectedDate: {
    date: undefined
  },
  filtersAdapter: filtersAdapter.getInitialState(),
  itemsAdapter: itemsAdapter.getInitialState(),
  categoriesAdapter: categoriesAdapter.getInitialState(),
  layout: {
    siderCollapsed: false,
    selectedMenuKey: '1'
  },
  feedbackModalOpen: false
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
    feedbackModalOpened: (state, action: PayloadAction<boolean>) => {
      state.feedbackModalOpen = action.payload
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
    deletingItemStatusChanged: (state) => {
      state.deletingItem = { status: 'idle', error: undefined }
    },
    updatingItemStatusChanged: (state) => {
      state.updatingItem = { status: 'idle', error: undefined }
    },
    insertingCategoryStatusChanged: (state) => {
      state.insertingCategory = { status: 'idle', error: undefined }
    },
    fetchingItemStatusChanged: (state) => {
      state.fetchingItems = { status: 'idle', error: undefined }
    },
    sendingFeedbackStatusChanged: (state) => {
      state.sendingFeedback = { status: 'idle', error: undefined }
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
    },
    editingItemSet: (state, action: PayloadAction<ItemEntity | undefined>) => {
      state.addItemModal.editingItem = action.payload
    },
    filtersInitialSet: (state) => {
      const mappedItemTypes = [
        { label: 'Event', id: 'event', isSelected: true, itemType: 'event' },
        { label: 'Task', id: 'task', isSelected: true, itemType: 'task' },
        { label: 'Reminder', id: 'reminder', isSelected: true, itemType: 'reminder' }
      ]

      const categories = categoriesAdapter.getSelectors().selectAll(state.categoriesAdapter)

      const mappedCategories = categories.map(cat => ({ label: cat.name, id: cat.id, isSelected: true }))

      const filters: FilterOption[] = [...mappedItemTypes, ...mappedCategories]

      filtersAdapter.addMany(state.filtersAdapter, filters)
    },
    filtersUpdated: (state, action: PayloadAction<string[]>) => {
      const selectedIds = new Set(action.payload)

      const allFilters = filtersAdapter.getSelectors().selectAll(state.filtersAdapter)

      allFilters.forEach(filter => {
        const isSelected = selectedIds.has(filter.id)

        filtersAdapter.updateOne(state.filtersAdapter, {
          id: filter.id,
          changes: { isSelected }
        })
      })
    },
    menuKeySelected: (state, action: PayloadAction<string>) => {
      state.layout.selectedMenuKey = action.payload
    },
    siderCollapseSet: (state, action: PayloadAction<boolean>) => {
      state.layout.siderCollapsed = action.payload
    },
    calendarSelectedDateSet: (state, action: PayloadAction<{ date: string | undefined }>) => {
      if (action.payload.date) {
        state.calendarSelectedDate.date = action.payload.date
      } else {
        state.calendarSelectedDate.date = undefined
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

        if (items) {
          itemsAdapter.setAll(state.itemsAdapter, items)
        }

        state.fetchingItems.status = 'succeeded'
      })
      .addCase(fetchItemsAsync.rejected, (state) => {
        state.fetchingItems.status = 'failed'
      })

      .addCase(insertItemAsync.pending, (state) => {
        state.insertingItem.status = 'loading'
      })
      .addCase(insertItemAsync.fulfilled, (state, action) => {
        const itemEntity = action.payload

        if (itemEntity) {
          itemsAdapter.setOne(state.itemsAdapter, itemEntity)
        }

        state.addItemModal.open = false
        state.insertingItem.status = 'succeeded'
      })
      .addCase(insertItemAsync.rejected, (state) => {
        state.insertingItem.status = 'failed'
      })

      .addCase(insertCategoryAsync.pending, (state) => {
        state.insertingCategory.status = 'loading'
      })
      .addCase(insertCategoryAsync.fulfilled, (state, action) => {
        const categoryEntity = action.payload

        if (categoryEntity) {
          categoriesAdapter.setOne(state.categoriesAdapter, categoryEntity)

          filtersAdapter.setOne(state.filtersAdapter, {
            id: categoryEntity.id,
            label: categoryEntity.name,
            isSelected: true
          })
        }

        state.categoryModal.open = false
        state.insertingCategory.status = 'succeeded'
      })
      .addCase(insertCategoryAsync.rejected, (state) => {
        state.insertingCategory.status = 'failed'
      })

      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.fetchingCategories.status = 'loading'
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        const categories = action.payload

        if (categories) {
          categoriesAdapter.addMany(state.categoriesAdapter, categories)
        }

        state.categoryModal.open = false
        state.fetchingCategories.status = 'succeeded'
      })
      .addCase(fetchCategoriesAsync.rejected, (state) => {
        state.fetchingCategories.status = 'failed'
      })

      .addCase(updateItemAsync.pending, (state) => {
        state.updatingItem.status = 'loading'
      })
      .addCase(updateItemAsync.fulfilled, (state, action) => {
        const itemEntity = action.payload

        if (itemEntity) {
          itemsAdapter.updateOne(state.itemsAdapter, {
            id: itemEntity.id,
            changes: {
              ...itemEntity
            }
          })
        }

        state.itemModal.open = false
        state.addItemModal.open = false
        state.updatingItem.status = 'succeeded'
      })
      .addCase(updateItemAsync.rejected, (state) => {
        state.updatingItem.status = 'failed'
      })

      .addCase(deleteItemAsync.pending, (state) => {
        state.deletingItem.status = 'loading'
      })
      .addCase(deleteItemAsync.fulfilled, (state, action) => {
        const itemId = action.meta.arg

        itemsAdapter.removeOne(state.itemsAdapter, itemId)

        state.itemModal.open = false
        state.deletingItem.status = 'succeeded'
      })
      .addCase(deleteItemAsync.rejected, (state) => {
        state.deletingItem.status = 'failed'
      })

      .addCase(logoutUser, (state) => {
        itemsAdapter.removeAll(state.itemsAdapter)
        categoriesAdapter.removeAll(state.categoriesAdapter)
        filtersAdapter.removeAll(state.filtersAdapter)
      })

      .addCase(submitFeedbackAsync.pending, (state) => {
        state.sendingFeedback.status = 'loading'
      })
      .addCase(submitFeedbackAsync.fulfilled, (state) => {
        state.sendingFeedback.status = 'succeeded'
        state.feedbackModalOpen = false
      })
      .addCase(submitFeedbackAsync.rejected, (state) => {
        state.sendingFeedback.status = 'failed'
      })

  }
})

export const insertItemAsync = createAsyncThunk(
  'calendar/insertItem',
  async (item: Item, { getState }) => {
    const state = getState() as RootState
    const userId = state.auth.userId

    if (userId) {
      return await insertItem(item, userId)
    }
  }
)

export const fetchItemsAsync = createAsyncThunk(
  'calendar/fetchItems',
  async (_, { getState }) => {
    const state = getState() as RootState
    const userId = state.auth.userId

    if (userId) {
      return await fetchItems(userId)
    }
  }
)

export const updateItemAsync = createAsyncThunk(
  'items/updateItem',
  async (item: ItemEntity, { getState }) => {
    const state = getState() as RootState
    const userId = state.auth.userId

    if (userId) {
      return await updateItem(item, userId)
    }
  }
)

export const deleteItemAsync = createAsyncThunk(
  'items/deleteItem',
  async (id: string, { getState }) => {
    const state = getState() as RootState
    const userId = state.auth.userId

    if (userId) {
      await deleteItem(id, userId)
    }
  }
)

export const insertCategoryAsync = createAsyncThunk(
  'calendar/insertCategory',
  async (category: Category, { getState }) => {
    const state = getState() as RootState
    const userId = state.auth.userId

    if (userId) {
      return await insertCategory(category, userId)
    }
  }
)

export const fetchCategoriesAsync = createAsyncThunk(
  'calendar/fetchCategories',
  async (_, { getState }) => {
    const state = getState() as RootState
    const userId = state.auth.userId

    if (userId) {
      return await fetchCategories(userId)
    }
  }
)

export const submitFeedbackAsync = createAsyncThunk(
  'feedback/submit',
  async (params: FeedbackParams) => {
    await submitFeedback(params)
  }
)

export const selectModalState = (state: RootState) => state.scheduler.addItemModal
export const selectItemModalState = (state: RootState) => state.scheduler.itemModal
export const selectInsertingItemState = (state: RootState) => state.scheduler.insertingItem
export const selectUpdatingItemState = (state: RootState) => state.scheduler.updatingItem
export const selectDeletingItemState = (state: RootState) => state.scheduler.deletingItem
export const selectInsertingCategoryState = (state: RootState) => state.scheduler.insertingCategory
export const selectCategoryModal = (state: RootState) => state.scheduler.categoryModal
export const selectSelectedCalendarDate = (state: RootState) => state.scheduler.calendarSelectedDate
export const selectSendingFeedbackState = (state: RootState) => state.scheduler.sendingFeedback
export const selectFeedbackModalOpened = (state: RootState) => state.scheduler.feedbackModalOpen

export const selectLeyout = (state: RootState) => state.scheduler.layout

export const itemsSelectors = itemsAdapter.getSelectors(
  (state: RootState) => state.scheduler.itemsAdapter
)

export const categoriesSelectors = categoriesAdapter.getSelectors(
  (state: RootState) => state.scheduler.categoriesAdapter
)

export const filtersSelectors = filtersAdapter.getSelectors(
  (state: RootState) => state.scheduler.filtersAdapter
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
  todoValueChanched,
  deletingItemStatusChanged,
  updatingItemStatusChanged,
  editingItemSet,
  filtersInitialSet,
  filtersUpdated,
  menuKeySelected,
  siderCollapseSet,
  calendarSelectedDateSet,
  feedbackModalOpened,
  sendingFeedbackStatusChanged
} = schedulerSlice.actions

export default schedulerSlice.reducer