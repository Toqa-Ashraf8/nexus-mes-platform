import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstanse, { axiosMultipartInstance } from '../../../app/axiosInstance'

export const fetchSapProducts=createAsyncThunk("fetchSapProducts/processDefinition",async()=>{
    const resp=await axiosInstanse.get("ProductSync/products")
    .then((res)=>res.data);
    return resp;
})
export const saveImageUrl=createAsyncThunk("saveImageUrl/processDefinition",async({data,Folder})=>{
    const resp=await axiosMultipartInstance.post(`ProcessDefinition/UpdloadImages?Folder=${Folder}`,data)
    .then((res)=>res.data);
    return resp;
})
export const saveVideoUrl=createAsyncThunk("saveVideoUrl/processDefinition",async({data,Folder})=>{
    const resp=await axiosMultipartInstance.post(`ProcessDefinition/UploadVideos?Folder=${Folder}`,data)
    .then((res)=>res.data);
    return resp;
})
export const saveSapProducts=createAsyncThunk("saveSapProducts/processDefinition",async()=>{
    const resp=await axiosInstanse.post("ProcessDefinition/ImportSapXml")
    .then((res)=>res.data);
    return resp;
})
export const releaseProduct=createAsyncThunk("ReleaseProduct/processDefinition",async(product)=>{
    const resp=await axiosInstanse.post("ProcessDefinition/ReleaseDefinition",product)
    .then((res)=>res.data);
    return resp;
})