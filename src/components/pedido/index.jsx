import { useState } from "react";
import Star from "../../assets/star.png";
import Star2 from "../../assets/star2.png";
import api from "../../services/api";
import "./style.css";

export default function Pedido(props) {
  const dt_ped = new Date(props.dt_pedido)
  const [avaliar, setAvaliar] = useState(false)
  const [avaliacao, setAvaliacao] = useState(props.avaliacao)

  function Status(st) {
    switch (st) {
      case 'P': return 'Pedido em produção'
      case 'E': return 'Saiu para a entrega'
      case 'A': return 'Aguardando...'
      case 'F': return 'Finalizado'
      default: return ""
    }
  }

  function Avaliar(avaliacao) {
    api.patch(`/v1/pedidos/avaliacao/${props.id_pedido}`, {
      avaliacao
    })
      .then(response => {
        setAvaliacao(avaliacao)
        setAvaliar(false)
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <div className="border-bottom p-3 pb-3 d-flex justify-content-between">
      <div className="d-flex">
        <div className="me-4 img-pedido">
          <img className="img-pedido" src={props.url_image} alt="Pedido" />
        </div>

        <div className="d-inline-block">
          <span className="d-block">
            <b>{props.nome}</b>
          </span>
          <small className="text-danger d-block">Pedido Nº {props.id_pedido}</small>
          <small>
            {" "}
            {props.qtd_item} {props.qtd_item > 1 ? "itens" : "item"} - R${" "}
            {new Intl.NumberFormat("pt-br", {
              style: "currency",
              currency: "BRL",
            }).format(props.vl_total)}{" "}
            - {new Intl.DateTimeFormat('pt-br').format(dt_ped)}
          </small>
          <div>
            {
              !["A", "E", "P"].includes(props.status) ?
                <>
                  <img src={avaliacao > 0 ? Star : Star2} alt="avaliação"/>
                  <img src={avaliacao > 1 ? Star : Star2} alt="avaliação"/>
                  <img src={avaliacao > 2 ? Star : Star2} alt="avaliação"/>
                  <img src={avaliacao > 3 ? Star : Star2} alt="avaliação"/>
                  <img src={avaliacao > 4 ? Star : Star2} alt="avaliação"/>
                </> : null
            }

          </div>
          <span className="badge bg-secondary text-light">{Status(props.status)}</span>
        </div>
      </div>

      <div className="d-flex align-items-center">
        {
          !["A", "E", "P"].includes(props.status) && !avaliar ?
            <button onClick={(e) => setAvaliar(true)} className="btn btn-outline-danger">Avaliar</button> : null
        }

        {
          avaliar ?
            <div>
              <img src={Star2} alt="avaliação" onClick={(e) => Avaliar(1)} className="avaliar"/>
              <img src={Star2} alt="avaliação" onClick={(e) => Avaliar(2)} className="avaliar"/>
              <img src={Star2} alt="avaliação" onClick={(e) => Avaliar(3)} className="avaliar"/>
              <img src={Star2} alt="avaliação" onClick={(e) => Avaliar(4)} className="avaliar"/>
              <img src={Star2} alt="avaliação" onClick={(e) => Avaliar(5)} className="avaliar"/>
            </div> : null
        }
      </div>
    </div>
  );
}
