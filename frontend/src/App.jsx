import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./pages/LandingPage";
// main.jsx বা App.jsx এর একদম উপরে যোগ করো
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:slug" element={<LandingPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;