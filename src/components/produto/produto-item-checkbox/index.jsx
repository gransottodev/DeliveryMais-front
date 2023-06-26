import { CurrencyFormat } from "../../../utils/currency_format";

export default function ProdutoItemCheckBox(props) {
  return (
    <div className="card mt-4">
      <div className="card-header d-flex justify-content-between">
        {props.titulo}
      </div>
      <ul className="list-group list-group-flush">
        {props.opcoes.map((opcao) => {
          return (
            <li className="list-group-item d-flex justify-content-between" key={opcao.id_item}>
              <div>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  name={`flexCheckDefault1${opcao.id_opcao}`}
                  id={`flexCheckDefault1${opcao.id_item}`}
                  onClick={e => props.onClickItem(e.target.checked ,{
                    id_opcao: opcao.id_opcao,
                    nome: opcao.nome_item,
                    id_item: opcao.id_item,
                    vl_item: opcao.vl_item,
                    ordem: opcao.ordem
                  })}
                />
                <label
                  className="form-check-label ms-2"
                  htmlFor={`flexCheckDefault1${opcao.id_item}`}
                >
                  {opcao.nome_item}
                </label>
              </div>
              <span className="text-danger">{CurrencyFormat(opcao.vl_item)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
