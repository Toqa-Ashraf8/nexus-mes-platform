import { createSlice } from "@reduxjs/toolkit";
import { fetchSapProducts } from "../services/processDefinitionService";

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
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchSapProducts.fulfilled,(state,action)=>{
            state.products=action.payload;
        })
    }
})
export const {toggleProductsModal}=processDefinitionSlice.actions;
const processDefinitionReducer=processDefinitionSlice.reducer;
export default processDefinitionReducer;