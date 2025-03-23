import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./login/login";
import Dashboard from "./Instructors/Dashboard"; // Assuming you have a dashboard component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />{" "}
        {/* Redirect unknown routes to login */}
      </Routes>
    </Router>
  );
}

export default App;
