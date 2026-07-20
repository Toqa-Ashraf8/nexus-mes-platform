import { createSlice } from "@reduxjs/toolkit";

const initialState={
    products:[],
    isProductsModalOpen:false
}

const processDefinitionSlice=createSlice({
    name:'processDefinition',
    initialState,
    reducers:{
        toggleProductsModal:(state,action)=>{
            state.isProductsModalOpen=action.payload;
        }
    }
})
export const {toggleProductsModal}=processDefinitionSlice.actions;
const processDefinitionReducer=processDefinitionSlice.reducer;
export default processDefinitionReducer;