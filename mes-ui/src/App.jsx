import './App.css'
import Navbar from './components/Navbar'
import {Route , Routes} from 'react-router-dom'
import ProcessDefinition from './features/production/pages/ProcessDefinition'
import {ToastContainer,toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { clearGlobalError } from './app/uiSlice'
import DispatchList from './features/production/pages/DispatchList'
function App() {
  const { 
  isLoading, 
  globalError, 
  globalMessage 
} = useSelector((state) => state.ui);
const dispatch=useDispatch();
useEffect(() => {
    if (globalError) {
      toast.error(globalMessage || "An internal server error occurred.");
      dispatch(clearGlobalError());
    }
  }, [globalError, globalMessage, dispatch]);

  return (
    <div>
      <ToastContainer 
      position="top-right"      
      autoClose={4000}         
      hideProgressBar={false}   
      newestOnTop={true}
      closeOnClick
      rtl={false}             
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"          
      className="custom-toast-container" 
      />
   <Navbar/>
   <Routes>
    <Route path="/order-dispatching" element={<DispatchList/>}/>
    <Route path="/process-definition" element={<ProcessDefinition/>}/>  
   </Routes>
    </div>
  )
}

export default App
