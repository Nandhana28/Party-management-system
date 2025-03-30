import { Routes, Route } from "react-router-dom";
import ClientLogin from "./components/clientLogin";
import CreateAccount from "./components/createAccount";
import Login from "./components/loginform";
import TodayEvents from "./components/todayEvents";
import Bookings from "./components/booking";
import HallSelection from "./components/HallSelection";
import Payment from "./components/Payment";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />  {/* Admin Login */}
      <Route path="/Clientlogin" element={<ClientLogin />} />  {/* Client Login */}
      <Route path="/register" element={<CreateAccount />} />
      
      {/* Protected Routes (only accessible if logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/today-events" element={<TodayEvents />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/hall-selection" element={<HallSelection />} />
        <Route path="/payment" element={<Payment />} />
      </Route>
      
      {/* Default route (for when no match is found) */}
      <Route path="/" element={<ClientLogin />} />
    </Routes>
  );
}

export default App;
