import { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import api from "../../services/api";

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  function DisplayMsg() {
    setMsg("Dados Alterados com sucesso");

    setTimeout(() => {
      setMsg("");
    }, 3000);
  }

  function DisplayError(error) {
    setError(error);
    setTimeout(() => setError(""), 5000);
  }

  function SalvarDados() {
    api
      .patch("/v1/usuarios", {
        nome,
        email,
      })
      .then(() => DisplayMsg())
      .catch((error) => {
        if (error.response) {
          DisplayError(error.response.data.erro);
        } else {
          DisplayError("Ocorreu um erro na requisição, tente novamente!");
        }
      });
  }

  useEffect(() => {
    api
      .get(`/v1/usuarios/${localStorage.getItem("sessionId")}`)
      .then((response) => {
        setNome(response.data.nome);
        setEmail(response.data.email);
      });
  }, []);

  return (
    <div className="row col-lg-6 offset-lg-3">
      <Navbar />
      <div className="container-fluid mt-page mb-page">
        <div className="row m-2">
          <h3>Meu Perfil</h3>
        </div>

        <div className="row m-2">
          <form>
            <div className="mb-3">
              <label htmlFor="inputNome" className="form-label">
                Nome
              </label>
              <input
                type="text"
                id="inputNome"
                className="form-control"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label htmlFor="inputEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="inputEmail"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </form>
          <div className="d-flex justify-content-end">
            <button
              type="button mt-3"
              className="btn btn-lg btn-danger"
              value={email}
              onClick={SalvarDados}
            >
              Salvar Dados
            </button>
          </div>
          {msg.length > 0 ? (
            <div className="alert alert-success mt-4 text-center">{msg}</div>
          ) : null}
          {error.length > 0 ? (
            <div className="alert alert-danger mt-4 text-center">{error}</div>
          ) : null}
        </div>
        <div className="fixed-bottom">
          <Footer />
        </div>
      </div>
    </div>
  );
}
