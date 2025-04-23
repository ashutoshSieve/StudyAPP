import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Main from './components/Main';
import TaskDetails from './components/TaskDetails';
import Analysis from './components/Analysis';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/main" element={<Main/>} />
        <Route path="/task/:id" element={<TaskDetails/>} />
        <Route path="/analysis/:taskId/:subtaskId" element={<Analysis/>} />
      </Routes>
    </Router>
  );
}

export default App;
