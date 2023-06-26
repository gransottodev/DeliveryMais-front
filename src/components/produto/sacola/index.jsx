import { CurrencyFormat } from "../../../utils/currency_format";

export default function Sacola(props) {
  return (
    <div className="col-12">
      <div className="row p-3 ps-0 border-bottom">
        <div className="col-3">
          <img className="img-fluid rounded" src={props.url_foto} />
        </div>
        <div className="col-9">
          <div className="d-flex justify-content-between align-items-center">
            <small>
              <b>{props.nome}</b>
            </small>
            <small className="ms-2">
              <b>{CurrencyFormat(props.vl_unit * props.qtd)}</b>
            </small>
          </div>

          <small className="d-block mb-2">
            {props.qtd + " X " + CurrencyFormat(props.vl_unit)}
          </small>

          {
            props.detalhes ? (
              props.detalhes.map(detalhe => {
                return <small key={detalhe.id_item} className="text-secondary d-block">- {detalhe.nome}</small>
              })
            ) : null
          }

          {props.removerItem ? (
            <button
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={(e) => props.removerItem(props.id_carrinho)}
            >
              {" "}
              Remover{" "}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
