import {configureStore} from '@reduxjs/toolkit';
import processDefinitionReducer from '../features/production/slices/processDefinitionSlice';
import uiReducer from './uiSlice';
import dispatchListReducer from '../features/production/slices/dispatchListSlice';

export const store =configureStore({
    reducer:{
        processDefinition:processDefinitionReducer,
        ui:uiReducer,
        dispatchList:dispatchListReducer
    }
})