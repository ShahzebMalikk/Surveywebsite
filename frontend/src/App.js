import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SlotForm } from './Components/SlotForm';
import { Thankyou } from './Components/Thankyou';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<SlotForm />} />
          <Route path="thankyou" element={<Thankyou />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
