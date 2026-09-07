import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import NavBar from './NavBar';
import CycleTracker from './CycleTracker';
import Calendar from './Calendar';
import Diary from './Diary';
import Reminders from './Reminders';
import Login from './Login';
import Signup from './Signup';
import BottomNav from './BottomNav';

function App({ clerkPubKey }) {
  return (
    <ClerkProvider publishableKey={clerkPubKey}
      signInUrl="/login"
      signUpUrl="/signup">

      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<CycleTracker />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/signup/*" element={<Signup />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
