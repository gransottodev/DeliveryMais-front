import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./style.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function openSidebar() {
    const event = new CustomEvent("openSidebar");
    window.dispatchEvent(event);
  }

  function handleSearch() {
    navigate(`/busca?q=${search}`);
  }

  function Logout() {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("sessionEmail");
    localStorage.removeItem("sessionCodCidade");
    localStorage.removeItem("sessionCidade");
    localStorage.removeItem("sessionUf");
    navigate("/login");
  }

  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light ps-3 pe-3">
      <div className="container-fluid">
        <Link className="navbar-brand mt-1" to="/">
          <img src={logo} alt="Delivery Mais" className="logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="ms-auto me-auto mt-1">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Procurar um restaurante"
                aria-label="search"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="btn btn-danger"
                type="button"
                id="button-addon2"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          <div className="mt-1 navbar-content">
            <Link
              to={"/trocar-endereco"}
              className="btn btn-outline-danger me-3 endereco"
            >
              <i className="fas fa-map-marker-alt"></i> Entrega:{" "}
              {localStorage.getItem("sessionCidade")}
            </Link>
            {
              // <button className='btn btn-outline-danger me-3'><i className='fas fa-sign-in-alt'>Acessar</i></button>
            }
            <div className="navbar-container">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-outline-danger me-3 dropdown-toggle usuario"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user"></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/pedidos" className="dropdown-item">
                      Pedidos
                    </Link>
                  </li>
                  <li>
                    <Link to="/favoritos" className="dropdown-item">
                      Favoritos
                    </Link>
                  </li>
                  <li>
                    <Link to="/perfil" className="dropdown-item">
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <Link to="/enderecos" className="dropdown-item">
                      Meus Endereços
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a href="#" className="dropdown-item" onClick={Logout}>
                      Sair
                    </a>
                  </li>
                </ul>
              </div>

              <button
                onClick={openSidebar}
                className="btn btn-outline-danger sacola"
              >
                <i className="fas fa-shopping-bag"></i> Sacola{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
