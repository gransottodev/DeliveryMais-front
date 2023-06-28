import { useState, useEffect} from 'react'
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import Pedido from '../../components/pedido'
import api from '../../services/api'



export default function Pedidos(){
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/v1/pedidos').then(response => {
      setPedidos(response.data)
      setLoading(false)
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  return(
    <div className='container-fluid mt-page'> 
      <Navbar />

      <div className="row col-lg-8 offset-lg-2">
        <div className="col-12 mt-2">
          <h2 className='mt-2'>Meus Pedidos</h2>
        </div>
        
        {loading ? (
          <div className="text-center m-5">
            <span
              className="spinner-grow spinner-grow-sm text-danger"
              role="status"
            ></span>
            <span className="ms-2 text-danger">Buscando pedidos...</span>
          </div>
        ) : null}
        <div className='row mt-5'>
          {
            pedidos.map(pedido => {
              return(
                <Pedido
                        key={pedido.id_pedido}
                        id_pedido={pedido.id_pedido}
                        id_estabelecimento={pedido.id_estabelecimento}
                        nome={pedido.nome}
                        url_image={pedido.url_logo}
                        avaliacao={pedido.avaliacao} 
                        qtd_item={pedido.qtd_item}
                        vl_total={pedido.vl_total}
                        dt_pedido={pedido.dt_pedido}
                        status={pedido.status}
                      />
              )
            })
          }
        </div>

      </div>
      <Footer />
  </div>
  )
}