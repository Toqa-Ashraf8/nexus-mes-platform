import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: 'ui',
  initialState: 
  { 
    globalError: false, 
    globalMessage: "" ,
    isLoading:false,
  },
  reducers: {
    clearGlobalError: (state) => { state.globalError = false; }
  },
  // For API Errors
  extraReducers: (builder) => {
    builder
   .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
      state.isLoading = true;
    })
    .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => {
      state.isLoading = false;
    })
    .addMatcher((action) => action.type.endsWith('/rejected'), (state) => {
      state.isLoading = false;
      state.globalError = true;
      state.globalMessage = "System error occurred. Please try again.";
    });

  }
});
export const {clearGlobalError}=uiSlice.actions;
const uiReducer=uiSlice.reducer;
export default uiReducer;