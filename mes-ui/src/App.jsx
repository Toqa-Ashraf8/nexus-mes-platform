import './App.css'
import Navbar from './components/Navbar'
import {Route , Routes} from 'react-router-dom'
import ProcessDefinition from './features/production/pages/ProcessDefinition'
import DispatchingManagement from './features/production/pages/DispatchingManagement'
function App() {

  return (
    <div>
   <Navbar/>
   <Routes>
    <Route path="/order-dispatching" element={<DispatchingManagement/>}/>
    <Route path="/process-definition" element={<ProcessDefinition/>}/>  
   </Routes>
    </div>
  )
}

export default App
