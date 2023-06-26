import { useState, useEffect } from "react";
import Endereco from "../../components/enderecos/lista";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Enderecos() {
  const [enderecos, setEnderecos] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get("/v1/usuarios/enderecos")
      .then((response) => {
        setEnderecos(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  function trocarEnderecoPadrao(endereco){
    localStorage.setItem('sessionCidade', endereco.cidade)
    localStorage.setItem('sessionUf', endereco.uf)
    localStorage.setItem('sessionCodCidade', endereco.cod_cidade)
    navigate('/')
  }

  return (
    <div className="container-fluid mt-page">
      <Navbar />
      <div className="row col-lg-6 offset-lg-3">
        <div className="col-12 mt-4 d-flex justify-content-between">
          <h2 className="mt-2">Selecione seu endereço</h2>
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
                cod_cidade={endereco.cod_cidade}
                uf={endereco.uf}
                cep={endereco.cep}
                padrao={endereco.ind_padrao}
                complemento={endereco.complemento}
                onClickTrocarEnderecoPadrao={trocarEnderecoPadrao}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
