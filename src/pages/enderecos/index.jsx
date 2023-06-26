import { useState, useEffect } from "react";
import Endereco from "../../components/enderecos/lista";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { EnderecoModal } from "../../components/enderecos/modal";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import api from "../../services/api";

export default function Enderecos() {
  const [openModal, setOpenModal] = useState(false);
  const [enderecos, setEnderecos] = useState([]);
  const [dadosEndereco, setDadosEndereco] = useState([])

  function ListarEnderecos() {
    api
      .get("/v1/usuarios/enderecos")
      .then((response) => {
        setEnderecos(response.data);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    ListarEnderecos();
  }, []);

  function openModalEndereco(id) {
    if (id > 0) {
      api.get(`/v1/usuarios/enderecos/${id}`)
        .then(response => {
          setDadosEndereco(response.data[0])
          setOpenModal(true)
        })
        .catch(error => console.log(error))
    } else {
      setDadosEndereco([])
      setOpenModal(true)
    }
  }

  function deleteEndereco(id) {
    confirmAlert({
      title: 'Excluir',
      message: 'Excluir endereço?',
      buttons: [
        {
          label: 'Sim',
          onClick: () => {
            api.delete(`/v1/usuarios/enderecos/${id}`)
              .then(response => {
                ListarEnderecos()
              })
              .catch(error => console.log(error))
          }
        },
        {
          label: 'Não',
          onClick: () => null
        }
      ]
    });
  }

  function closeModalEndereco() {
    setOpenModal(false);
    ListarEnderecos()
  }

  function enderecoPadrao(id) {
    api.patch(`/v1/usuarios/enderecos/padrao/${id}`)
      .then(response => {
        ListarEnderecos()
      })
      .catch(error => console.log(error))
  }

  return (
    <div className="container-fluid mt-page">
      <Navbar />
      <EnderecoModal
        isOpen={openModal}
        onRequestClose={closeModalEndereco}
        dados_endereco={dadosEndereco}
      />
      <div className="row col-lg-6 offset-lg-3">
        <div className="col-12 mt-4 d-flex justify-content-between">
          <h2 className="mt-2">Meus Endereços</h2>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={e => openModalEndereco(0)}
          >
            Adicionar endereço
          </button>
        </div>

        <div className="row mt-5">
          {enderecos.map((endereco) => {
            return (
              <Endereco
                key={endereco.id_endereco}
                id_endereco={endereco.id_endereco}
                endereco={endereco.endereco}
                bairro={endereco.bairro}
                cidade={endereco.cidade}
                uf={endereco.uf}
                cep={endereco.cep}
                padrao={endereco.ind_padrao}
                complemento={endereco.complemento}
                onClickEdit={openModalEndereco}
                onClickDelete={deleteEndereco}
                onClickPadrao={enderecoPadrao}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
