import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import GameInfo from "./pages/GameInfo/GameInfo";
import Cart from "./pages/Cart/Cart";
import AdminPanel from "./pages/Admin/AdminPanel";
import User from "./pages/User/User";
import Favoritos from "./pages/Favoritos/Favoritos";
import "./App.css";

export default function App() {
  return (
    <Router>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jogo/:jogoId" element={<GameInfo />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/admin" element={<AdminPanel />} />          
          <Route path="/user" element={<User />} />          
          <Route path="/favoritos" element={<Favoritos />} />          
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}
