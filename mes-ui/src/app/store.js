import {configureStore} from '@reduxjs/toolkit';
import processDefinitionReducer from '../features/production/slices/processDefinitionSlice';

export const store =configureStore({
    reducer:{
        processDefinition:processDefinitionReducer
    }
})