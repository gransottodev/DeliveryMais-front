import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ModalProduto from "react-modal/lib/components/Modal";
import closeIcon from "../../../assets/close.png";
import ProdutoItemRadio from "../produto-item-radio";
import ProdutoItemCheckBox from "../produto-item-checkbox";
import { CurrencyFormat } from "../../../utils/currency_format";
import { FormatDecimal } from "../../../utils/format-decimal";
import { CartContext } from "../../../contexts/cart-context";
import api from "../../../services/api";
import "./style.css";

export default function Modal(props) {
  const [id_produto, setId_produto] = useState(0);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [vl_produto, setVl_produto] = useState("");
  const [vl_promocao, setVl_promocao] = useState("");
  const [url_foto, setUrl_foto] = useState("");
  const [qtd, setQtd] = useState(1);
  const [opcoes, setOpcoes] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const { cart ,addItemCart } = useContext(CartContext);
  const [blockBtn, setBlockBtn] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (props.id_produto === 0) {
      return;
    }

    api
      .get(`/v1/produtos/${props.id_produto}`)
      .then((response) => {
        setId_produto(response.data.id_produto);
        setId_produto(response.data.id_produto);
        setNome(response.data.nome);
        setDescricao(response.data.descricao);
        setVl_produto(response.data.vl_produto);
        setVl_promocao(response.data.vl_promocao);
        setUrl_foto(response.data.url_foto);
        setQtd(1);
        setTotal(
          response.data.vl_promocao > 0
            ? response.data.vl_promocao
            : response.data.vl_produto
        );
      })
      .catch((error) => console.log(error));

    api
      .get(`/v1/cardapios/opcoes/${props.id_produto}`)
      .then((response) => {
        setOpcoes(response.data);

        let gruposUnico = response.data.map((grupo) => {
          return {
            id_opcao: grupo.id_opcao,
            id_produto: grupo.id_produto,
            descricao: grupo.descricao,
            ind_obrigatorio: grupo.ind_obrigatorio,
            qtd_max_escolha: grupo.qtd_max_escolha,
            ind_ativo: grupo.ind_ativo,
            ordem: grupo.ordem,
            selecao: [],
          };
        });

        gruposUnico = gruposUnico.filter((item, index, arr) => {
          return (
            arr.findIndex((i) => {
              return i.id_opcao === item.id_opcao;
            }) === index
          );
        });

        setGrupos(gruposUnico);
        habilitarBotao(gruposUnico);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [props.isOpen]);

  useEffect(() => {
    calcularTotal(grupos);
  }, [qtd]);

  function adicionarProduto() {
    setQtd(qtd + 1);
  }

  function removerProduto() {
    qtd > 1 ? setQtd(qtd - 1) : setQtd(1);
  }

  function selectRadioButton(data) {
    let g = grupos;

    let objIndex = grupos.findIndex((obj) => obj.id_opcao == data.id_opcao);

    g[objIndex].selecao = [data];

    setGrupos(g);
    habilitarBotao(g);
    calcularTotal(g);
  }

  function selectCheckBox(isChecked, data) {
    let g = grupos;
    let s = [];

    let objIndex = grupos.findIndex((obj) => obj.id_opcao == data.id_opcao);

    s = g[objIndex].selecao;

    if (isChecked) {
      s.push(data);
    } else {
      let objIndexSelecao = s.findIndex((obj) => obj.id_item == data.id_item);
      s.splice(objIndexSelecao, 1);
    }

    g[objIndex].selecao = s;
    setGrupos(g);
    habilitarBotao(g);
    calcularTotal(g);
  }

  function AddItem() {
    if(cart[0].id_estabelecimento !== props.id_estabelecimento){
      alert('Já existem produtos de outros restaurantes em sua sacola!')
      return
    }


    let detalhes = [];
    let vl_detalhes = 0;

    grupos.map((item) => {
      item.selecao.map((sel) => {
        vl_detalhes += sel.vl_item;

        detalhes.push({
          nome: sel.nome,
          id_item: sel.id_item,
          vl_item: sel.vl_item,
          ordem: sel.ordem,
        });
      });
    });

    const item = {
      id_carrinho: uuidv4(),
      id_produto: id_produto,
      id_estabelecimento: props.id_estabelecimento,
      nome: nome,
      descricao: nome,
      qtd: qtd,
      vl_unit: vl_detalhes + (vl_promocao > 0 ? vl_promocao : vl_produto),
      vl_total:
        (vl_detalhes + (vl_promocao > 0 ? vl_promocao : vl_produto)) * qtd,
      url_foto: url_foto,
      detalhes,
    };

    addItemCart(item);
    props.onRequestClose();
  }

  function habilitarBotao(grp) {
    let bloquear = false;

    grp.map((item) => {
      if (item.ind_obrigatorio == "S" && item.selecao.length == 0) {
        bloquear = true;
      }
    });
    setBlockBtn(bloquear);
  }

  function calcularTotal(grp) {
    let vl_selecao = 0;
    let vl_prod = vl_promocao > 0 ? vl_promocao : vl_produto;

    grp.map((item) => {
      item.selecao.map((sel) => {
        vl_selecao += sel.vl_item;
      });
    });

    setTotal((vl_selecao + vl_prod) * qtd);
  }

  return (
    <ModalProduto
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button onClick={props.onRequestClose} className="react-modal-close">
        <img src={closeIcon} alt="fechar" className="z-3" />
      </button>
      {loading ? (
        <div className="text-center m-5">
          <span
            className="spinner-grow spinner-grow-sm text-danger"
            role="status"
          ></span>
          <span className="ms-2 text-danger">Buscando dados do produto...</span>
        </div>
      ) : (
        <div className="container-fluid h-100 produto-modal">
          <div className="row detalhes-produto">
            <div>
              <img
                className="img-fluid rounded img-produto-modal"
                src={url_foto}
                alt="produto"
              />
            </div>

            <div className="col-12 mt-2">
              <h4 className="mt-2">{nome}</h4>
              <small className="d-block">{descricao}</small>
              {vl_promocao > 0 ? (
                <>
                  <small className="mt-3 promocao">
                    {CurrencyFormat(vl_promocao)}
                  </small>
                  <small className="mt-3 ms-4 preco-antigo">
                    {CurrencyFormat(vl_produto)}
                  </small>
                </>
              ) : (
                <small className="mt-3 text-success">
                  {CurrencyFormat(vl_produto)}
                </small>
              )}
            </div>
            <div className="col-12 mb-4">
              {grupos.map((grupo) => {
                let op = opcoes.filter((item, index, arr) => {
                  return item.id_opcao == grupo.id_opcao;
                });

                return grupo.qtd_max_escolha === 1 ? (
                  <ProdutoItemRadio
                    key={grupo.id_opcao}
                    titulo={grupo.descricao}
                    obrigatorio={grupo.ind_obrigatorio == "S"}
                    opcoes={op}
                    onClickItem={selectRadioButton}
                  />
                ) : (
                  <ProdutoItemCheckBox
                    key={grupo.id_opcao}
                    titulo={grupo.descricao}
                    opcoes={op}
                    onClickItem={selectCheckBox}
                  />
                );
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-12 mt-3 d-flex justify-content-end">
              <div className="cartActions">
                <div>
                  <button
                    className="btn btn-outline-danger"
                    onClick={removerProduto}
                  >
                    <i className="fa-solid fa-minus" />
                  </button>
                  <span className="m-3 button-qtd">{FormatDecimal(qtd)}</span>
                  <button
                    className="btn btn-outline-danger"
                    onClick={adicionarProduto}
                  >
                    <i className="fa-solid fa-plus" />
                  </button>
                </div>

                <button
                  className="btn btn-danger btn-adicionar"
                  onClick={AddItem}
                  disabled={blockBtn}
                >
                  Adicionar a sacola ({CurrencyFormat(total)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalProduto>
  );
}
