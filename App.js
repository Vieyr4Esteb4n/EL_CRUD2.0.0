import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AddEditMove from "./pages/AddEditMove";
import NavBar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEditMove />} />
          <Route path="/update/:id" element={<AddEditMove />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
