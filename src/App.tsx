import "./App.css";
import "./images/saveTheDate.jpeg";
import { Route, Routes } from "react-router-dom";
import UserCamera from "./Camera/CameraWrapper";
import Gallery from "./Gallery/Gallery";

function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<UserCamera />} />
        <Route path="/gallery" element={<Gallery timelapse={8000} />} />
      </Routes>
    </main>
  );
}

export default App;
