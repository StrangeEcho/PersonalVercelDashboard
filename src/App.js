import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Projects from "./Pages/Projects";
import Deployments from "./Pages/Deployments";
import Insights from "./Pages/Insights";
import UserSettings from "./Pages/UserSettings";

function Navigation() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("userId");
    navigate("/");
  }

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>{" | "}
      <Link to="/projects">Projects</Link>{" | "}
      <Link to="/deployments">Deployments</Link>{" | "}
      <Link to="/insights">Insights</Link>{" | "}
      <Link to="/settings">User Settings</Link>{" | "}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/deployments" element={<Deployments />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/settings" element={<UserSettings />} />
      </Routes>
    </BrowserRouter>
  );
}