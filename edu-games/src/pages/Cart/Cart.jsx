import "./cart.css";

export default function Cart() {
  return (
    <section className="cart-container">
      <h2>Carrinho de Compras</h2>
      <p>Seu carrinho está vazio</p>
      <button className="btn-primario">Finalizar Compra</button>
    </section>
  );
}
