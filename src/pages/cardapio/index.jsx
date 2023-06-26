import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Produto from "../../components/produto/lista";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Modal from "../../components/produto/modal";
import Star from "../../assets/star.png";
import Favorito from "../../assets/favorito.png";
import Favorito2 from "../../assets/favorito2.png";
import api from "../../services/api";
import { CurrencyFormat } from "../../utils/currency_format";
import { CartContext } from '../../contexts/cart-context'
import "./style.css";

export default function Cardapio() {
  const { cart, setEntregaCart, setIdEstabelecimento, idEstaebelecimento } = useContext(CartContext)

  const params = useParams();
  const id = params.id;
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [avaliacao, setAvaliacao] = useState(0);
  const [foto, setFoto] = useState("");
  const [entrega, setEntrega] = useState(0);
  const [minimo, setMinimo] = useState(0);
  const [qtd, setQtd] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [favorito, setFavorito] = useState(false);
  const [idFavorito, setIdFavorito] = useState(0);
  const [id_produto, setId_produto] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    api
      .get(`v1/estabelecimentos/${id}`)
      .then((response) => {
        setNome(response.data[0].nome);
        setEndereco(response.data[0].endereco);
        setComplemento(response.data[0].complemento);
        setBairro(response.data[0].bairro);
        setCidade(response.data[0].cidade);
        setUf(response.data[0].uf);
        setAvaliacao(response.data[0].avaliacao);
        setFoto(response.data[0].url_foto);
        setEntrega(response.data[0].vl_taxa_entrega);
        setMinimo(response.data[0].vl_min_pedido);
        setQtd(response.data[0].qtd_avaliacao);
        setFavorito(response.data[0].id_favorito > 0);
        setIdFavorito(response.data[0].id_favorito);
      })
      .catch((err) => {
        console.log(err);
      });

    api
      .get(`v1/cardapios/${id}`)
      .then((response) => {
        let categoriasUnica = response.data.map((item) => item.categoria);

        categoriasUnica = categoriasUnica.filter(
          (itemArray, i, arrayCompleto) => {
            return arrayCompleto.indexOf(itemArray) === i;
          }
        );
        setCategorias(categoriasUnica);
        setProdutos(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function AdicionarFavorito() {
    api
      .post(`/v1/estabelecimentos/favoritos`, {
        id_estabelecimento: id,
      })
      .then((response) => {
        setFavorito(true);
        setIdFavorito(response.data.id_favorito);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function RemoverFavorito() {
    api
      .delete(`/v1/estabelecimentos/favoritos/${idFavorito}`)
      .then((response) => {
        setFavorito(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function openModalProduto(id_prod) {
    if (cart.length > 0 && idEstaebelecimento != id && idEstaebelecimento > 0) {
      alert('Já existem produtos de outros restaurantes na sacola')
      return
    }
    setId_produto(id_prod)
    setEntregaCart(entrega);
    setIdEstabelecimento(id)
    setOpenModal(true);
  }

  function closeModalProduto() {
    setOpenModal(false);
  }

  return (
    <div className="container-fluid cardapio mt-page">
      <Navbar />
      <Modal
        isOpen={openModal}
        onRequestClose={closeModalProduto}
        id_produto={id_produto}
      />

      <div className="row col-lg-8 offset-lg-2">
        <div className="col-12">
          <img
            className="img-fluid rounded img-estabelecimento"
            src={foto}
            alt="Cardapio"
          />
        </div>

        <div className="col-12 mt-4">
          <div className="d-flex justify-content-between">
            <h2>{nome}</h2>
            <div className="favorito">
              {favorito ? (
                <img
                  src={Favorito2}
                  alt="Remover Favorito"
                  onClick={RemoverFavorito}
                />
              ) : (
                <img
                  src={Favorito}
                  alt="Adicionar Favorito"
                  onClick={AdicionarFavorito}
                />
              )}
            </div>
          </div>

          <div className="classificacao">
            <span>
              {endereco} {complemento.length > 0 ? " - " + complemento : null}{" "}
              {bairro} - {cidade} - {uf}{" "}
            </span>
          </div>

          <div className="classificacao">
            <img src={Star} alt="avaliação" />
            <span className="ms-1">{avaliacao.toFixed(1)}</span>
            <span className="ms-3">{qtd} avaliações</span>
          </div>

          <div className="classificacao mt-3">
            <span>
              <b>Taxa de entrega : </b>
              {CurrencyFormat(entrega)}
            </span>
            <span className="ms-5">
              <b>Pedido Mínimo : </b>
              {CurrencyFormat(minimo)}
            </span>
          </div>
        </div>

        {categorias.map((categoria) => {
          return (
            <div key={categoria} className="row mt-5">
              <div>
                <h5 className="mb-3">{categoria}</h5>
              </div>

              {produtos.map((produto) => {
                return produto.categoria === categoria ? (
                  <Produto
                    key={produto.id_produto}
                    id_produto={produto.id_produto}
                    nome={produto.nome}
                    descricao={produto.descricao}
                    url_foto={produto.url_foto}
                    vl_produto={produto.vl_produto}
                    vl_promocao={produto.vl_promocao}
                    onClickProduto={openModalProduto}
                  />
                ) : null;
              })}
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}
