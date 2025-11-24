import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import GameInfo from "./pages/GameInfo/GameInfo";
import Cart from "./pages/Cart/Cart";
import Usuario from "./pages/Admin/Usuario";
import Dashboard from "./pages/Admin/Dashboard";
import Empresa from "./pages/Admin/Empresa";
import Jogos from "./pages/Admin/Jogos";
import User from "./pages/User/User";
import Favoritos from "./pages/Favoritos/Favoritos";
 import AdminRoute from "../src/components/AdminRoute/AdminRoute";
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
         
          <Route
            path="/admin/user"
            element={
              <AdminRoute>
                <Usuario />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/empresa"
            element={
              <AdminRoute>
                <Empresa />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/jogo"
            element={
              <AdminRoute>
                <Jogos />
              </AdminRoute>
            }
          />
          <Route path="/user" element={<User />} />
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}