import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo-pb.png'
import Background from '../../assets/fundo-login.jpg'
import api from '../../services/api'
import './style.css'

export default function Login(){

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [sucesso, setSucesso] = useState(true)
  const [loading, setLoading] = useState(false)

  async function handleLogin(event){
    event.preventDefault()

    setLoading(true)

    await api.post('v1/usuarios/login', {
      email,
      senha: senha
    })
    .then(response => {

      localStorage.setItem('sessionToken', response.data.token)
      localStorage.setItem('sessionId', response.data.id_usuario)
      localStorage.setItem('sessionEmail', email)
      localStorage.setItem('sessionCodCidade', response.data.cod_cidade)
      localStorage.setItem('sessionCidade', response.data.cidade)
      localStorage.setItem('sessionUf', response.data.uf)
      navigate('/')
    })
    .catch(err => {
      setSucesso(false)
      setLoading(false)
    })

  }

  return(
    <div className='row'>
      <div className='col-sm-6 d-flex justify-content-center align-items-center text-center'>
        <form className='form-login mt-5'>
          <h3 className='mb-4'>Peça seu delivery agora mesmo.</h3>
          <h6 className='mb-3'>Acesse sua conta</h6>

          <div className="form-floating" >
            <input 
              name='email' 
              type="email" 
              onChange={e => setEmail(e.target.value)} 
              className="form-control" 
              placeholder="name@example.com" 
            />
            <label htmlFor="floatingInput">E-mail</label>
          </div>

          <div className="form-floating">
            <input 
              name='senha' 
              type="password" 
              onChange={e => setSenha(e.target.value)}
              className="form-control" 
              placeholder="Senha" 
            />
            <label htmlFor="floatingInput">Senha</label>
          </div>

          <button onClick={handleLogin} className='w-100 btn btn-lg btn-danger mb-2' disabled={loading}>
            {
              loading ? 
            <div>
              <span className="spinner-border spinner-border-sm text-danger" role="status"></span> 
              <span className="ms-2">Entrando</span>
            </div> : 'Acessar'
            }
            
          </button>
          
          {
            sucesso === false ? <div className="alert alert-danger mt-2">Email ou senha incorretos!</div> : null
          }
          

          <div className='mt-5'>
            <Link to='/cadastro'>Não tenho conta. Criar Agora!</Link>
          </div>

          <img className='mt-5' src={Logo} alt="Devilery Mais" />

        </form>
      </div>

      <div className="col-sm-6 px-0 d-none d-sm-block">
        <img className='background-login' src={Background} alt="Delivery" />
      </div>
    </div>
  )
}