import Modal from "react-modal/lib/components/Modal";
import { useEffect, useState } from "react";
import closeIcon from "../../../assets/close.png";
import api from "../../../services/api";
import "./style.css";

Modal.setAppElement('#root')

export function EnderecoModal(props) {
  const [endereco, setEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');
  const [codCidade, setCodCidade] = useState();
  const [id_endereco, setId_Endereco] = useState(0)
  const [ind_padrao, setInd_padrao] = useState()
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    setId_Endereco(props.dados_endereco.id_endereco)
    setEndereco(props.dados_endereco.endereco)
    setComplemento(props.dados_endereco.complemento)
    setBairro(props.dados_endereco.bairro)
    setCidade(props.dados_endereco.cidade)
    setUf(props.dados_endereco.uf)
    setCep(props.dados_endereco.cep)
    setInd_padrao('N')
    setCodCidade(props.dados_endereco.cod_cidade)

    api
      .get("/v1/cidades")
      .then((response) => {
        setCidades(response.data);
      })
      .catch((error) => console.log(error));
  }, [props.isOpen]);

  function salvarCidade(e) {
    const [cid, est] = e.target[e.target.selectedIndex].text.split(" - ");
    setCidade(cid);
    setUf(est);
    setCodCidade(e.target.value);
  }

  function SalvarEndereco(){
    setMensagem('')

    if(id_endereco > 0){
      api.patch(`/v1/usuarios/enderecos/${id_endereco}`, {
        endereco,
        complemento,
        bairro,
        cidade,
        uf,
        cep,
        ind_padrao,
        cod_cidade: codCidade
      })
      .then(response => props.onRequestClose())
      .catch(error => {
        if(error.response){
          setMensagem(error.response.data.erro)
        } else {
          setMensagem('Ocorreu um erro na requisição')
        }
      })
    } else {
      api.post(`/v1/usuarios/enderecos`, {
        endereco,
        complemento,
        bairro,
        cidade,
        uf,
        cep,
        ind_padrao,
        cod_cidade: codCidade
      })
      .then(response => props.onRequestClose())
      .catch(error => {
        if(error.response){
          setMensagem(error.response.data.erro)
        } else {
          setMensagem('Ocorreu um erro na requisição')
        }
      })
    }
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button onClick={props.onRequestClose} className="react-modal-close">
        <img
          src={closeIcon}
          alt="fechar"
          className="z-3"
          onClick={props.onRequestClose}
        />
      </button>

      <div className="container-fluid h-100 endereco">
        <div className="col-12 mt-4">
          <h4 className="mt-2 mb-4">Adicionar Endereço</h4>
          <form className="form-cadastro">
            <div className="row">
              <div className="mb-3 col-8 d-inline-block">
                <label htmlFor="nome" className="form-label mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  onChange={(e) => setEndereco(e.target.value)}
                  value={endereco}
                  className="form-control mb-2"
                  id="nome"
                />
              </div>
              <div className="mb-3 col-4 d-inline-block">
                <label htmlFor="complemento" className="form-label mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  onChange={(e) => setComplemento(e.target.value)}
                  value={complemento}
                  className="form-control mb-2"
                  id="complemento"
                  placeholder="Ex: Ap 62"
                />
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-12">
                <label htmlFor="bairro" className="form-label mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  onChange={(e) => setBairro(e.target.value)}
                  value={bairro}
                  className="form-control mb-2"
                  id="bairro"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <label htmlFor="cidade" className="form-label mb-1">
                  Cidade
                </label>
                <div className="form-control mb-3">
                  <select
                    name="cidades"
                    id="cidades"
                    onChange={salvarCidade}
                    value={codCidade}
                  >
                    <option value="0000000">Escolha a cidade</option>

                    {cidades.map((cidade) => {
                      return (
                        <option
                          value={cidade.cod_cidade}
                          key={cidade.cod_cidade}
                        >
                          {cidade.cidade} - {cidade.uf}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-1 col-12">
                <label htmlFor="cep" className="form-label mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  onChange={(e) => setCep(e.target.value)}
                  value={cep}
                  className="form-control"
                  id="cep"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="row mb-3">
          <div className="col-12 d-flex justify-content-end align-items-center">
            <button onClick={SalvarEndereco} className="btn btn-lg btn-danger">Salvar Dados</button>
          </div>
        </div>

        {mensagem.length > 0 ? <div className="alert alert-danger">{mensagem}</div> : null}
      </div>
    </Modal>
  );
}
