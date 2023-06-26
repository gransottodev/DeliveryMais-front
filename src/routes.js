import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Componentes gerais
import Sidebar from './components/sidebar'

// PrivateRoutes component
import { PrivateRoutes } from './auth/private-routes/private-routes'

// Pages
import Home from './pages/home'
import Busca from './pages/busca'
import Cardapio from './pages/cardapio'
import Endereco from './pages/enderecos'
import Favoritos from './pages/favoritos'
import Pedidos from './pages/pedidos'
import Perfil from './pages/perfil'
import Login from './pages/login'
import Cadastro from './pages/cadastro'
import TrocarEndereco from './pages/trocar-endereco'
import { Checkout } from './pages/checkout'

export default function Rotas(){
  return(
    <>
    <BrowserRouter>
      <Sidebar/>
      <Routes>
        <Route>
          <Route exact path="/" element={<PrivateRoutes><Home/></PrivateRoutes>} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/cadastro' element={<Cadastro />}/>
          <Route exact path="/busca" element={<PrivateRoutes><Busca /></PrivateRoutes>} />
          <Route exact path="/cardapio/:id" element={<PrivateRoutes><Cardapio /></PrivateRoutes>} />
          <Route exact path="/enderecos" element={<PrivateRoutes><Endereco /></PrivateRoutes>} />
          <Route exact path="/favoritos" element={<PrivateRoutes><Favoritos /></PrivateRoutes>} />
          <Route exact path="/pedidos" element={<PrivateRoutes><Pedidos /></PrivateRoutes>} />
          <Route exact path="/perfil" element={<PrivateRoutes><Perfil /></PrivateRoutes>} />
          <Route exact path="/trocar-endereco" element={<PrivateRoutes><TrocarEndereco /></PrivateRoutes>} />
          <Route exact path="/checkout" element={<PrivateRoutes><Checkout /></PrivateRoutes>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}