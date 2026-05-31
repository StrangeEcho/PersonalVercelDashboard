import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Projects from "./Pages/Projects";
import Deployments from "./Pages/Deployments";
import Insights from "./Pages/Insights";

export default function App() {
  return (
    <BrowserRouter>

      <nav>
        <Link to="/">Logout</Link>{" | "}
        <Link to="/projects">Projects</Link>{" | "}
        <Link to="/deployments">Deployments</Link>{" | "}
        <Link to="/insights">Insights</Link>{" | "}
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/deployments" element={<Deployments/>} />
        <Route path="/insights" element={<Insights/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>

    </BrowserRouter>
  );
}