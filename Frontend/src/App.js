import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientLogin from "./components/clientLogin";
import CreateAccount from "./components/createAccount";
import Login from "./components/loginform"
import TodayEvents from "./components/todayEvents"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Clientlogin" element={<ClientLogin />} />
      <Route path="/register" element={<CreateAccount />} />
      <Route path="/today-events" element={<TodayEvents />} /> {/* Add this route */}
    </Routes>
  );
}

export default App;
