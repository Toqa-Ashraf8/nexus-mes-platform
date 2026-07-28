import { createSlice } from "@reduxjs/toolkit";
import { fetchReleasedWorkOrders } from "../services/dispatchListService";

const initialState = {
  workOrders: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 5,
  totalPages: 0,
  loading: false,
  error: null,
  activeTab: 'Pending',
  searchQuery: '',
  selectedWorkstation: 'ALL',
  selectedPriority: 'ALL',
  dateSortOrder: 'ASC'
};
const dispatchListSlice = createSlice({
  name: 'dispatchList',
  initialState,
  reducers: {
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.pageNumber = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pageNumber = 1;
    },
    setSelectedWorkstation: (state, action) => {
      state.selectedWorkstation = action.payload;
      state.pageNumber = 1;
    },
    setSelectedPriority: (state, action) => {
      state.selectedPriority = action.payload;
      state.pageNumber = 1;
    },
    setDateSortOrder: (state, action) => {
      state.dateSortOrder = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedWorkstation = 'ALL';
      state.selectedPriority = 'ALL';
      state.dateSortOrder = 'ASC';
      state.pageNumber = 1;
    },
    releaseWorkOrder: (state, action) => {
      const workOrderID = action.payload;
      const order = state.workOrders.find((o) => o.workOrderID === workOrderID);
      if (order) {
        order.status = 'Released';
      }
    },
    toggleHoldWorkOrder: (state, action) => {
      const workOrderID = action.payload;
      const order = state.workOrders.find((o) => o.workOrderID === workOrderID);
      if (order) {
        order.status = order.status === 'On Hold' ? 'Unreleased' : 'On Hold';
      }
    },
    saveEditedOrder: (state, action) => {
      const updatedOrder = action.payload;
      const index = state.workOrders.findIndex((o) => o.workOrderID === updatedOrder.workOrderID);
      if (index !== -1) {
        state.workOrders[index] = updatedOrder;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReleasedWorkOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReleasedWorkOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.workOrders = action.payload.items || action.payload.Items || [];
        state.totalCount = action.payload.totalCount || action.payload.TotalCount || 0;
        state.pageNumber = action.payload.pageNumber || state.pageNumber;
        state.pageSize = action.payload.pageSize || state.pageSize;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize) || 1;
      })
     
  }
});

export const {
  setPageNumber,
  setActiveTab,
  setSearchQuery,
  setSelectedWorkstation,
  setSelectedPriority,
  setDateSortOrder,
  resetFilters,
  releaseWorkOrder,
  toggleHoldWorkOrder,
  saveEditedOrder
} = dispatchListSlice.actions;
const dispatchListReducer=dispatchListSlice.reducer;
export default dispatchListReducer;
