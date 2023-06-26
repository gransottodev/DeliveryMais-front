import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../contexts/cart-context";
import { CurrencyFormat } from "../../utils/currency_format";
import Navbar from "../../components/navbar";
import Produto from "../../components/produto/sacola";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export function Checkout() {
  const {
    cart,
    setCart,
    idEstabelecimento,
    subtotal,
    cupom,
    setId_cupom,
    id_cupom,
    desconto,
    entregaCart,
    total,
  } = useContext(CartContext);

  const [enderecos, setEnderecos] = useState([]);
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cep, setCep] = useState("");
  const [codCidade, setCodCidade] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/");
      return;
    }

    api
      .get("/v1/usuarios/enderecos", {
        params: {
          cod_cidade: localStorage.getItem("sessionCodCidade"),
        },
      })
      .then((response) => {
        setEnderecos(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if(cart.length === 0) {
      navigate('/')
    }
  }, [cart]);

  function finalizarPedido() {
    api
      .post("/v1/pedidos", {
        id_estabelecimento: idEstabelecimento,
        id_cupom: id_cupom ?? 0,
        vl_taxa_entrega: entregaCart,
        vl_desconto: desconto,
        vl_total: total,
        endereco,
        complemento,
        bairro,
        cidade,
        uf,
        cep,
        cod_cidade: codCidade,
        itens: cart,
      })
      .then((response) => {
        if (response.data) {
          localStorage.removeItem("sessionCart");
          setCart([]);
          setId_cupom(0);
          navigate("/pedidos");
        } else {
          alert("Erro ao enviar o pedido");
        }
      })
      .catch((error) => console.log(error));
  }

  function selecionarEndereco(endereco) {
    setEndereco(endereco.endereco);
    setComplemento(endereco.complemento);
    setBairro(endereco.bairro);
    setCidade(endereco.cidade);
    setUf(endereco.uf);
    setCep(endereco.cep);
    setCodCidade(endereco.codCidade);
  }

  return (
    <div className="container-fluid mt-page">
      <Navbar />
      <div className="row col-lg-6 offset-lg-3">
        <h2 className="mt-2">Finalizar pedido</h2>

        <div className="mt-3">
          {cart.map((produto) => {
            return (
              <div key={produto.id_carrinho}>
                <Produto
                  id_produto={produto.id_produto}
                  id_carrinho={produto.id_carrinho}
                  nome={produto.nome}
                  qtd={produto.qtd}
                  vl_unit={produto.vl_unit}
                  vl_total={produto.qtd * produto.vl_unit}
                  url_foto={produto.url_foto}
                  detalhes={produto.detalhes}
                />
              </div>
            );
          })}
        </div>

        <div className="row align-items-end mt-5">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <span>Subtotal</span>
            <span>{CurrencyFormat(subtotal)}</span>
          </div>

          <div className="col-12 d-flex justify-content-between align-items-center mt-2">
            <span>
              Desconto{" "}
              {desconto > 0 ? (
                <span className="text-success">{`(Cupom ${cupom})`}</span>
              ) : null}
            </span>
            <span className="d-inline-blok text-success">
              {" "}
              - {CurrencyFormat(desconto)}
            </span>
          </div>

          <div className="col-12 d-flex justify-content-between align-items-center mt-2">
            <span>Taxa de Entrega: </span>
            <span>{CurrencyFormat(entregaCart)}</span>
          </div>

          <div className="col-12 d-flex justify-content-between align-items-center mt-3">
            <b>Total :</b>
            <h3>{CurrencyFormat(total)}</h3>
          </div>
        </div>

        <div className="mt-5 mb-5">
          <h4>Endereço de entrega</h4>
          <div className="row">
            <ul className="list-group list-group-flush">
              {enderecos.map((endereco) => {
                return (
                  <li
                    className="list-group-item p-3"
                    key={endereco.id_endereco}
                  >
                    <li className="list-group-item border border-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id={`flexRadioDefault${endereco.id_endereco}`}
                        onClick={(e) => selecionarEndereco(endereco)}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor={`flexRadioDefault${endereco.id_endereco}`}
                      >
                        <b>
                          {endereco.endereco}{" "}
                          {endereco.complemento.length > 0
                            ? ` - ${endereco.complemento}`
                            : null}
                        </b>
                        <small className="d-block">
                          {endereco.cidade} - {endereco.uf}
                        </small>
                      </label>
                    </li>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="row mb-5">
            <button
              className="btn btn-lg btn-danger mt-4"
              onClick={finalizarPedido}
              disabled={endereco.length == 0}
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
