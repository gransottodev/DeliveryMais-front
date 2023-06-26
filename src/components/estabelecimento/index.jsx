import { Link } from "react-router-dom";
import Star from "../../assets/star.png";
import "./style.css";

export default function Estabelecimento(props) {
  return (
    <div className="estabelecimento col-sm-6 col-md-4 col-lg-3 mb-3 p-2">
      <Link to={`/cardapio/${props.id_estabelecimento}`}>
        <div className="row">
          <div className="col-3">
            <img
              className="img_estabelecimento"
              src={props.url_image}
              alt="estabelecimento"
            />{" "}
            <br />
          </div>
          <div className="col-9 mt-2 ps-1">
            <span>{props.nome}</span> <br />
            <div className="avaliacao">
              <img src={Star} alt="avaliação" />
              <span>
                {" "}
                {props.avaliacao.toFixed(1)} - {props.categoria}{" "}
              </span>
            </div>
          </div>
        </div>
      </Link>
      {props.btnIsRequired ? (
        <button
          className="btn btn-sm btn-outline-danger mt-2"
          onClick={(e) => props.onClickRemove(props.id_favorito)}
        >
          Remover
        </button>
      ) : null}
    </div>
  );
}
