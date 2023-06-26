import { CurrencyFormat } from '../../../utils/currency_format'
import './style.css'

export default function Produto(props){
  return(
    <div className='col-sm-6 mb-3 p-4 produto-lista'>
      <a onClick={e => props.onClickProduto(props.id_produto)}>
        <div className="row p-3 ps-0 border-bottom">
          <div className="col-3">
            <img 
              className='img-fluid rounded' 
              src={props.url_foto} 
              alt={props.descricao} 
            />
          </div>
          <div className="col-9">
            <span className='d-block'><b>{props.nome}</b></span>
            <small className='d-block'>{props.descricao}</small>

            { props.vl_promocao > 0 ? 
              <>
              <span className="badge text-bg-success d-inline-block mt-3">
                {CurrencyFormat(props.vl_promocao)}
              </span>
              <small className='d-inline-block ms-4 mt-3 preco-antigo'>
                {CurrencyFormat(props.vl_produto)}
              </small>
              </>
              :
              <small className='d-inline-block mt-3'>
                {CurrencyFormat(props.vl_produto)}
              </small>
            }
          </div>
        </div>
      </a>
    </div>
  )
}