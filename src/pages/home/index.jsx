import { useEffect, useState, useContext} from "react"
import Categoria from "../../components/categorias"
import Banner from "../../components/banner"
import Estabelecimento from "../../components/estabelecimento"
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import api from '../../services/api'
import { CartContext } from "../../contexts/cart-context"

export default function Home(){

  const [categorias, setCategorias] = useState([])
  const [banners, setBanners] = useState([])
  const [grupos, setGrupos] = useState([])
  const [destaques, setDestaques] = useState([])
  const {nome} = useContext(CartContext)

  const cod = localStorage.getItem('sessionCodCidade') ? localStorage.getItem('sessionCodCidade') : null

  useEffect(() => { 
    api.get(`v1/categorias?cod_cidade=${cod}`)
    .then(response => {
      setCategorias(response.data);
    })
    .catch(err => {
      console.log(err);
    })

    api.get(`v1/banners?cod_cidade=${cod}`)
    .then(response => {
      setBanners(response.data)
    })
    .catch(err => {
      console.log(err);
    })

    api.get(`v1/destaques?cod_cidade=${cod}`)
    .then(response => {

      let gruposUnico = response.data.map(grupo => grupo.descricao)

      gruposUnico = gruposUnico.filter((itemArray, i, arrayCompleto) => {
        return arrayCompleto.indexOf(itemArray) === i;
      })
  
      setGrupos(gruposUnico)
      setDestaques(response.data)

    })
    .catch(err => {
      console.log(err);
    })

  }, [])

  return(
    <div className="container-fluid mt-page">
      <Navbar/>
      <div className="row justify-content-center text-center">
        {
          categorias.map(categoria => {
            return <Categoria 
            key={categoria.id_categoria}
            id_categoria={categoria.id_categoria}
            url_image={categoria.foto} 
            descricao={categoria.categoria}
          />
          })
        }
      </div>
      <div className="row justify-content-center text-center mt-5">
        {
          banners.map(banner => {
            return <Banner 
            key={banner.id_banner}
            id_banner={banner.id_banner}
            descricao={banner.descricao} 
            url_image={banner.foto}
            />
          })
        }
      </div>

      {
        grupos.map(grupo => {
          return(
            <div key={grupo} className="row mt-5 m-2">
              <h4>{grupo}</h4>
              { 
                destaques.map(destaque => {
                  return destaque.descricao === grupo ?
                    <Estabelecimento
                      key={destaque.id_estabelecimento}
                      id_estabelecimento={destaque.id_estabelecimento}
                      url_image={destaque.url_logo}
                      nome={destaque.nome}
                      avaliacao={destaque.avaliacao}
                      categoria={destaque.categoria}
                    /> : null
                })
              }
            </div>
          )
        })
      }

        

      <Footer />
    </div>
  )
}