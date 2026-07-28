import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstanse, { axiosMultipartInstance } from '../../../app/axiosInstance'

export const fetchReleasedWorkOrders=createAsyncThunk("dispatchList/fetchReleasedWorkOrders",async({ pageNumber = 1, pageSize = 10 })=>{
    const resp=await axiosInstanse.get(`Dispatch/GetWorkOrdersList?PageNumber=${pageNumber}&PageSize=${pageSize}`)
    .then((res)=>res.data);
    return resp;
})