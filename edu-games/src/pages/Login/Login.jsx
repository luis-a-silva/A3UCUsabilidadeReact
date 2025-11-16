import { useEffect, useState } from "react";
import { loginUser, registerUser } from "../../api/authService.jsx";
import loginImg from "../../assets/login-img.png";
import registerImg from "../../assets/register-img.png";
import { mostrarMensagem } from "../../utils/alerta.js";
import Header from "../../components/Header/Header.jsx";
import "./login.css";

export default function Login() {
  const [message, setMessage] = useState(""); // ✅ mostra mensagem da API
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const containerLogin = document.getElementById("container-login");
    const containerCadastro = document.getElementById("container-cadastro");

    const btnIrParaCadastro = document.getElementById("btn-cadastrar");
    const btnIrParaLogin = document.getElementById("btn-login");

    const loginForm = document.getElementById("login-form");
    const cadastrarForm = document.getElementById("cadastrar-form");

    // 🔹 Alternar Login/Cadastro
    btnIrParaCadastro?.addEventListener("click", () => {
      containerLogin.classList.remove("form-login-active");
      containerLogin.classList.add("form-login-hide");
      containerCadastro.classList.add("form-cadastro-active");
      setMessage("");
    });

    btnIrParaLogin?.addEventListener("click", () => {
      containerCadastro.classList.remove("form-cadastro-active");
      containerLogin.classList.remove("form-login-hide");
      containerLogin.classList.add("form-login-active");
      setMessage("");
    });

    // 🔹 Login
    loginForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      const email = document.getElementById("email-login").value;
      const senha = document.getElementById("password-login").value;

      try {
        const res = await loginUser(email, senha);

        // ✅ Mostra a mensagem de sucesso da API
        mostrarMensagem(`${res.message}`, "success");

        // Se veio token, guarda e redireciona
        if (res.token) {
          localStorage.setItem("token", res.token);
          setTimeout(() => (window.location.href = "/home"), 1000);
        }
      } catch (err) {
        console.error(err);

        // ⚠️ Se a API retornar uma mensagem de erro, mostra no alert
        if (err.response && err.response.data && err.response.data.message) {
          mostrarMensagem(`${err.response.data.message}`, "danger");

        } else {
          mostrarMensagem("inesperado ao realizar login!", "danger");
        }
      } finally {
        setLoading(false);
      }
    });


    // 🔹 Cadastro
    cadastrarForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email-cadastro").value;
      const senha = document.getElementById("password-cadastro").value;
      const confirmar = document.getElementById("confirm-password-cadastro").value;

      if (senha !== confirmar) {
        mostrarMensagem("As senhas não coincidem!", "info");
        setLoading(false);
        return;
      }

      const dataInput = document.getElementById("data-nascimento").value; // yyyy-mm-dd
      const [ano, mes, dia] = dataInput.split("-");
      const dataNascimento = `${dia}/${mes}/${ano}`;


      try {
        const res = await registerUser(nome, email, senha, 2, dataNascimento);

        // ✅ Exibe mensagem de sucesso vinda da API
        mostrarMensagem(`${res.message}`, "info");

        // Se a mensagem contiver sucesso, volta para tela de login
        if (res.message?.toLowerCase().includes("sucesso")) {
          btnIrParaLogin?.click();
        }
      } catch (err) {
        // ⚠️ Captura o erro e tenta extrair a mensagem da API
        console.error(err);

        mostrarMensagem(` ${err.response.data.message}`, "danger");
      } finally {
        setLoading(false);
      }
    });

    return () => {
      btnIrParaCadastro?.removeEventListener("click", () => { });
      btnIrParaLogin?.removeEventListener("click", () => { });
      loginForm?.removeEventListener("submit", () => { });
      cadastrarForm?.removeEventListener("submit", () => { });
    };
  }, []);

  return (
    <>
      <Header />

      <div class="form-wrapper">
        {/* 🔹 Mensagem de retorno da API */}
        {message && <div className="api-message">{message}</div>}

        {/* Form de Login */}
        <div class="form-container form-login-active" id="container-login">
          <div class="left-decor">
            <img src={loginImg} alt="Imagem Login" />
          </div>
          <form id="login-form">
            <h2>Efetue seu login</h2>

            <label for="email-login">E-mail</label>
            <input
              type="email"
              id="email-login"
              placeholder="Digite seu e-mail"
              required
              disabled={loading}
            />

            <label for="password-login">Senha</label>
            <input
              type="password"
              id="password-login"
              placeholder="Digite sua senha"
              required
              disabled={loading}
            />

            <button type="submit" class="btn-primario" disabled={loading}>
              {loading ? "Aguarde..." : "Entrar"}
            </button>

            <div class="form-links">
              <span>Não possui uma conta?</span>
              <button type="button" id="btn-cadastrar" disabled={loading}>
                Cadastre-se
              </button>
            </div>
          </form>
        </div>

        {/* Form de Cadastro */}
        <div class="form-container form-cadastro" id="container-cadastro">
          <div class="left-decor">
            <img src={registerImg} alt="Imagem Cadastro" />
          </div>
          <form id="cadastrar-form">
            <h2>Faça seu cadastro!</h2>

            <label for="email-cadastro">E-mail</label>
            <input
              type="email"
              id="email-cadastro"
              placeholder="Digite seu e-mail"
              required
              disabled={loading}
            />

            <label for="nome">Nome</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu nome"
              required
              disabled={loading}
            />

            <label for="data-nascimento">Data de nascimento</label>
            <input type="date" id="data-nascimento" required disabled={loading} />

            <label for="password-cadastro">Senha</label>
            <input
              type="password"
              id="password-cadastro"
              placeholder="Digite sua senha"
              required
              disabled={loading}
            />

            <label for="confirm-password-cadastro">Confirme sua senha</label>
            <input
              type="password"
              id="confirm-password-cadastro"
              placeholder="Confirme sua senha"
              required
              disabled={loading}
            />

            <button type="submit" class="btn-primario" disabled={loading}>
              {loading ? "Aguarde..." : "Cadastrar"}
            </button>

            <div class="form-links">
              <span>Já possui uma conta?</span>
              <button type="button" id="btn-login" disabled={loading}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
