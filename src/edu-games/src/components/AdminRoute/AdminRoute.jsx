import { Navigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../../utils/auth";
import { mostrarMensagem } from "../../utils/alerta";

export default function AdminRoute({ children }) {

    //  Verificar se usuário está logado
    if (!isAuthenticated()) {
        mostrarMensagem("Você precisa estar logado para acessar esta página.", "info");
        return <Navigate to="/login" />;
    }

    // Verificar se usuário é admin
    if (!isAdmin()) {
        mostrarMensagem("Você não tem permissões suficientes.", "error");
        return <Navigate to="/" />;
    }

    // Autorizado
    return children;
}
