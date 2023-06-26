import Estabelecimento from '../../components/estabelecimento'
import Navbar from '../../components/navbar'
import api from '../../services/api'
import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

export default function Busca(){

  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [destaques, setDestaques] = useState([])
  const [mais, setMais] = useState(true)
  const [loading, setLoading] = useState(false)
  const [pagina, setPagina] = useState(1)

  var id_categoria = searchParams.get('id_cat')
  var id_banner = searchParams.get('id_banner')
  var descr = searchParams.get('descr') ?? 'Busca'
  var search = searchParams.get('q') ?? ''
  var pg = 0;

  const cod = localStorage.getItem('sessionCodCidade') ? localStorage.getItem('sessionCodCidade') : null

  function listarEstabelecimentos(indReset){
    setLoading(true)

    pg = indReset ? 1 : pagina + 1;
    
    api.get(`v1/estabelecimentos`,{
      params:{
        cod,
        nome: search,
        id_categoria,
        id_banner,
        pagina: pg
      }
    })
    .then(response => {
      if(indReset){
        setDestaques(response.data);
        setPagina(1)
      } else {
        setDestaques(oldArray => [...oldArray, ...response.data]);
        setPagina(pagina + 1)
      }

      setLoading(false)
      setMais(response.data.length >= 10)
    })
    .catch(err => {
      console.log(err);
      setLoading(false)
    })
  }

  useEffect(() =>{
    listarEstabelecimentos(true)
  }, [location])


  return(
    <div className='container-fluid mt-page mb-page'>
      <Navbar/>
      <div className="row m-2">
        <h3>{descr}</h3>
        {search.length > 0 ? <small className='mb-4 text-secondary'>Pesquisando por : {search}</small> : null}
      </div>

      <div className="row m-2">
        {
          destaques.map(destaque => {
            return(
              <Estabelecimento
                key={destaque.id_estabelecimento} 
                id_estabelecimento={destaque.id_estabelecimento}
                url_image={destaque.url_logo}
                nome={destaque.nome}
                avaliacao={destaque.avaliacao} 
                categoria={destaque.categoria}
              />
            )
          })
        }
      </div>

      {loading ?
        <div className='text-center m-5'>
          <span className="spinner-grow spinner-grow-sm text-danger" role="status"></span> 
          <span className="ms-2 text-danger">Buscando restaurantes ...</span>
        </div> : null
      }

      {!loading && mais ?
        <div className="row m-4 d-flex justify-content-center">
          <button 
            onClick={e => listarEstabelecimentos(false)} 
            className="btn btn-outline-danger"
          >
            Ver mais
          </button> 
        </div> : null
      }
        
    </div>
  )
}