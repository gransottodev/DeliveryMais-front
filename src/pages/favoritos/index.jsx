import { useEffect, useState } from 'react'
import Estabelecimento from '../../components/estabelecimento'
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import api from '../../services/api'

export default function Favoritos(){
  const [favoritos, setFavoritos] = useState([])

  function ListarFavoritos(){
    api.get('/v1/estabelecimentos/favoritos')
      .then(response => setFavoritos(response.data))
  }

  function DeleteFavorito(id){
    api.delete(`/v1/estabelecimentos/favoritos/${id}`)
      .then(() => ListarFavoritos())
      .catch(error => { console.log(error) })
  }

  useEffect(() => {
    ListarFavoritos()
  }, [])


  return(
    <div className='container-fluid mt-page'>
      <Navbar/>
      <div className="row col-lg-8 offset-lg-2">
        <div className="row m-2">
          <h3>Meus favoritos</h3>
        </div>

        <div className="row m-2">
          {
            favoritos.map(estabelecimento => {
              return(
                <Estabelecimento
                  key={estabelecimento.id_estabelecimento} 
                  url_image={estabelecimento.url_logo} 
                  nome={estabelecimento.nome}
                  avaliacao={estabelecimento.avaliacao} 
                  categoria={estabelecimento.categoria}
                  id_favorito={estabelecimento.id_favorito}
                  id_estabelecimento={estabelecimento.id_estabelecimento}
                  btnIsRequired
                  onClickRemove={DeleteFavorito}
                />
              )
            })
          }
        </div>
        <div className="fixed-bottom">
          <Footer/>
        </div>
      </div>
    </div>
  )
}