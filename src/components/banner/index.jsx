import { Link } from 'react-router-dom'
import './style.css'

export default function Banner(props) {
  return (
    <div className='banner col-sm-6 col-lg-3 mb-3'>
      <Link to={`/busca?id_banner=${props.id_banner}&descr=${props.descricao}`}>
        <div>
          <img className='img_banner' src={props.url_image}
            alt="banner" />
        </div>
      </Link>

    </div>
  )
}