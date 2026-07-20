import {configureStore} from '@reduxjs/toolkit';
import processDefinitionReducer from '../features/production/slices/processDefinitionSlice';
import uiReducer from './uiSlice';

export const store =configureStore({
    reducer:{
        processDefinition:processDefinitionReducer,
        ui:uiReducer
    }
})