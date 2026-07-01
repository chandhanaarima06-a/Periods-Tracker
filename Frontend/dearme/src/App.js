import './App.css';
import {BrowserRouter , Routes , Route } from 'react-router-dom';
import {ClerkProvider} from '@clerk/clerk-react';
import NavBar from './NavBar'; 
import CycleTracker from './CycleTracker';
import Login from './Login';
import Signup from './Signup';
function App({clerkPubKey}){
  return(
    <ClerkProvider publishableKey={clerkPubKey}
    signInUrl="/login"
    signInUrl="/signup">

      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<CycleTracker />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Signup" element={<Signup/>} />
      </Routes>
      
      </BrowserRouter>
      </ClerkProvider>
     
  );

}
export default App;