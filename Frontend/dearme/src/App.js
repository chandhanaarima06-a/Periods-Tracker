import './App.css';
import {BrowserRouter , Routes , Route } from 'react-router-dom';
import NavBar from './NavBar'; 
import CycleTracker from './CycleTracker';
import Login from './Login';
import Signup from './Signup';
function App(){
  return(
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<CycleTracker />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Signup" element={<Signup/>} />
      </Routes>
      
      </BrowserRouter>
     
  );

}
export default App;