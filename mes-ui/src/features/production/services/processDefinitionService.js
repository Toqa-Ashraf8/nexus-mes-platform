import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstanse from '../../../app/axiosInstance'

export const fetchSapProducts=createAsyncThunk("fetchSapProducts/processDefinition",async()=>{
    const resp=await axiosInstanse.get("ProductSync/products")
    .then((res)=>res.data);
    return resp;
})
export const releaseProduct=createAsyncThunk("ReleaseProduct/processDefinition",async(product)=>{
    const resp=await axiosInstanse.post("ProcessDefinition/ReleaseDefinition",product)
    .then((res)=>res.data);
    return resp;
})