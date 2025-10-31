import "./login.css";

export default function Login() {
    return (
        <div class="form-wrapper">
            {/* Form de Login */} 
            <div class="form-container form-login-active" id="container-login">
                <div class="left-decor">
                    <img src="../assets/login-img.png" alt="Imagem Login" />
                </div>
                <form id="login-form">
                    <h2>Efetue seu login</h2>
                    <label for="email-login">E-mail</label>
                    <input type="email" id="email-login" placeholder="Digite seu e-mail" required />
                    <label for="password-login">Senha</label>
                    <input type="password" id="password-login" placeholder="Digite sua senha" required />
                    <button type="submit" class="btn-primario">Entrar</button>
                    <div class="form-links">
                        <span>Não possui uma conta?</span>
                        <button type="button" id="btn-cadastrar">Cadastre-se</button>
                    </div>
                </form>
            </div>

            {/* Form de Cadastro */} 
            <div class="form-container form-cadastro" id="container-cadastro">
                <div class="left-decor">
                    <img src="../assets/register-img.png" alt="Imagem Cadastro" />
                </div>
                <form id="cadastrar-form">
                    <h2>Faça seu cadastro!</h2>
                    <label for="email-cadastro">E-mail</label>
                    <input type="email" id="email-cadastro" placeholder="Digite seu e-mail" required />
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" placeholder="Digite seu nome" required />
                    <label for="data-nascimento">Data de nascimento</label>
                    <input type="date" id="data-nascimento" required />
                    <label for="password-cadastro">Senha</label>
                    <input type="password" id="password-cadastro" placeholder="Digite sua senha" required />
                    <label for="confirm-password-cadastro">Confirme sua senha</label>
                    <input type="password" id="confirm-password-cadastro" placeholder="Confirme sua senha" required />
                    <button type="submit" class="btn-primario">Cadastrar</button>
                    <div class="form-links">
                        <span>Já possui uma conta?</span>
                        <button type="button" id="btn-login">Login</button>
                    </div>
                </form>
            </div>
        </div>     
  );
}
