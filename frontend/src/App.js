import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SlotForm } from './Components/SlotForm';
import { Thankyou } from './Components/Thankyou';
import { SignIn } from './Components/Signin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<SlotForm />} />
          <Route path="thankyou" element={<Thankyou />} />
          <Route path="signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
