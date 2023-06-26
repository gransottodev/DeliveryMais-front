import { CurrencyFormat } from "../../../utils/currency_format";

export default function ProdutoItemRadio(props) {
  return (
    <div className="card mt-4">
      <div className="card-header d-flex justify-content-between">
        {props.titulo}
        {props.obrigatorio && (
          <span className="badge bg-secondary">OBRIGATÓRIO</span>
        )}
      </div>

      <ul className="list-group list-group-flush">
        {props.opcoes.map((opcao) => {
          return (
            <li className="list-group-item d-flex justify-content-between" key={opcao.id_item}>
              <div>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`flexRadioDefault${opcao.id_opcao}`}
                  id={`flexRadioDefault${opcao.id_item}`}
                  onClick={e => props.onClickItem({
                    id_opcao: opcao.id_opcao,
                    nome: opcao.nome_item,
                    id_item: opcao.id_item,
                    vl_item: opcao.vl_item,
                    ordem: opcao.ordem
                  })}
                />
                <label
                  className="form-check-label ms-2"
                  htmlFor={`flexRadioDefault${opcao.id_item}`}
                >
                  {opcao.nome_item}
                </label>
              </div>
              <div>
                <span className="text-danger">{
                  opcao.vl_item > 0 ? "+ " + CurrencyFormat(opcao.vl_item) : null
                }</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
