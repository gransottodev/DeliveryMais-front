export default function Endereco(props) {
  return (
    <div className="col-12 pt-3 pb-3 border-bottom">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <span className="d-block">
            <b>
              {props.endereco}{" "}
              {props.complemento ? ` - ${props.complemento}` : ""}
            </b>
          </span>
          <small className="d-block">
            {props.bairro} - {props.cidade}
          </small>
          <small className="d-inline-block me-3">CEP: {props.cep}</small>
          <small className="text-danger d-block">
            {props.padrao == "S" ? "Endereço principal" : ""}
          </small>
        </div>

        <div>
          {props.padrao == "N" && props.onClickPadrao ? (
            <button
              className="btn btn-outline-secondary me-2 m-2"
              onClick={(e) => props.onClickPadrao(props.id_endereco)}
            >
              Tornar Padrão
            </button>
          ) : null}

          {props.onClickEdit ? (
            <button
              onClick={(e) => props.onClickEdit(props.id_endereco)}
              className="btn btn-outline-danger me-3 m-2"
            >
              Editar
            </button>
          ) : null}
          {props.padrao == "N" && props.onClickDelete ? (
            <button
              onClick={(e) => props.onClickDelete(props.id_endereco)}
              className="btn btn-danger m-2"
            >
              Excluir
            </button>
          ) : null}

          {props.onClickTrocarEnderecoPadrao ? (
            <button
              onClick={(e) =>
                props.onClickTrocarEnderecoPadrao({cidade: props.cidade, uf: props.uf, cod_cidade: props.cod_cidade})
              }
              className="btn btn-outline-danger me-3 m-2"
            >
              Selecionar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
