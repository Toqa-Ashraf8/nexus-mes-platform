import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstanse from '../../../app/axiosInstance'

export const fetchSapProducts=createAsyncThunk("fetchSapProducts/processDefinition",async()=>{
    const resp=await axiosInstanse.get("ProductSync/products")
    .then((res)=>res.data);
    return resp;
})