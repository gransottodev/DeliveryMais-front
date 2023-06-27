import { useContext, useEffect, useState } from "react";
import { Dock } from "react-dock";
import { CartContext } from "../../contexts/cart-context";
import closeIcon from '../../assets/close.png'
import Produto from "../produto/sacola";
import Sacola from "../../assets/bag.png";
import { CurrencyFormat } from "../../utils/currency_format";
import "./style.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const {
    cart,
    removerItem,
    subtotal,
    entregaCart,
    desconto,
    total,
    validarCupom,
    cupom,
    setCupom,
    msg,
  } = useContext(CartContext);
  const [show, setShow] = useState(false);
  const [cartWidth, setCartWidth] = useState(0);
  const [cartSize, setCartSize] = useState(0);
  const [cartBackIcon, setCartBackIcon] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("openSidebar", () => {
      setShow(true);
    });
  }, []);

  useEffect(() => {
    setCartWidth(window.innerWidth);
    window.addEventListener("resize", function () {
      let largura = window.innerWidth;
      setCartWidth(largura);
    });
  }, []);

  useEffect(() => {
    if (cartWidth >= 800) {
      setCartSize(420);
      setCartBackIcon(false)
    } else {
      setCartSize(cartWidth);
      setCartBackIcon(true);
    }
  }, [cartWidth]);

  function finalizarPedido() {
    setShow(false);
    navigate("/checkout");
  }

  return (
    <Dock
      position="right"
      isVisible={show}
      fluid={false}
      size={cartSize}
      onVisibleChange={(visible) => {
        setShow(visible);
      }}
    >
      {cartBackIcon ? (
        <button onClick={e => setShow(false)} className="react-modal-close">
        <img src={closeIcon} alt="fechar" className="z-3" />
      </button>
      ) : null}
      
      {cart.length > 0 ? (
        <div className="container-fluid h-100 pt-4 sidebar">
          <h5>Minha sacola</h5>
          <div className="row produtos">
            {cart.map((produto) => {
              return (
                <Produto
                  key={produto.id_carrinho}
                  id_produto={produto.id_produto}
                  id_carrinho={produto.id_carrinho}
                  nome={produto.nome}
                  qtd={produto.qtd}
                  vl_unit={produto.vl_unit}
                  vl_total={produto.qtd * produto.vl_unit}
                  url_foto={produto.url_foto}
                  removerItem={removerItem}
                  detalhes={produto.detalhes}
                />
              );
            })}
          </div>

          <div className="row align-items-end footer">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <span>Subtotal</span>
              <span>{CurrencyFormat(subtotal)}</span>
            </div>

            <div className="col-12 d-flex justify-content-between align-items-center mt-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cupom"
                  onChange={(e) => setCupom(e.target.value)}
                  value={cupom}
                />
                <button
                  className="btn btn-outline-success"
                  type="button"
                  id="button-addon2"
                  onClick={validarCupom}
                >
                  Aplicar
                </button>
              </div>

              <div className="d-flex flex-column input-group justify-content-center align-items-end">
                {msg.length > 0 ? (
                  <small className="text-danger ">{msg}</small>
                ) : null}
                <span className="d-inline-blok text-success">
                  {" "}
                  - {CurrencyFormat(desconto)}
                </span>
              </div>
            </div>

            <div className="col-12 d-flex justify-content-between align-items-center mt-2">
              <span>Taxa de Entrega: </span>
              <span>{CurrencyFormat(entregaCart)}</span>
            </div>

            <div className="col-12 d-flex justify-content-between align-items-center mt-3">
              <b>Total :</b>
              <h3>{CurrencyFormat(total)}</h3>
            </div>

            <button
              className="btn btn-lg btn-danger rounded-0 align-items-center btn_pedido"
              onClick={finalizarPedido}
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex h-100 flex-column justify-content-center align-items-center text-center">
          <img src={Sacola} alt="Sacola vazia" />
          <small className="mt-2 text-secondary">Sua sacola está vazia</small>
        </div>
      )}
    </Dock>
  );
}
