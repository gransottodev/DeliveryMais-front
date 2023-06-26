import Logo from '../../assets/logo-pb.png'
import Background from '../../assets/fundo-login.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import './style.css'

export default function Cadastro(){

  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senha2, setSenha2] = useState('')
  const [endereco, setEndereco] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cep, setCep] = useState('')
  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('')
  const [codCidade, setCodCidade] = useState('')
  const [menssagem, setMenssagem] = useState('')
  const [loading, setLoading] = useState('')
  const [cidades, setCidades] = useState([])

  function salvarCidade(e){
    const [cid, est] = e.target[e.target.selectedIndex].text.split(' - ')

    setCidade(cid)
    setUf(est)
    setCodCidade(e.target.value)
  }

  function handleCadastro(e){
    e.preventDefault()

    setMenssagem('')

    if(senha !== senha2){
      setMenssagem('As senhas são diferentes, por favor tente novamente')
      return
    }
    setLoading(true)

    api.post('v1/usuarios/registro',{
      nome,
      email,
      senha,
      endereco,
      complemento,
      bairro,
      cidade,
      uf,
      cep,
      cod_cidade: codCidade
    })
    .then(response => {
      if(response.status === 201){
        localStorage.setItem('sessionToken', response.data.token)
        localStorage.setItem('sessionId', response.data.id_usuario)
        localStorage.setItem('sessionEmail', email)
        localStorage.setItem('sessionCodCidade', codCidade)
        localStorage.setItem('sessionCidade', cidade)
        localStorage.setItem('sessionUf', uf)

        navigate('/')
      } else {
        setLoading(false)
        setMenssagem('Ocorreu um erro no cadastro' + response.status)
      }
    })
    .catch(err => {
      if(err.response){
        setMenssagem(err.response.data.erro)
      } else {
        setMenssagem('Houve um erro na requisição, tente novamente')
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    api.get('v1/cidades')
    .then(response => {
      setCidades(response.data)
    })
    .catch(err => {
      console.log(err);
    })
  }, [])

  return(
    <div className='row'>
      <div className='col-sm-6 d-flex justify-content-center align-items-center text-center'>
        <form className='form-cadastro'>
          <h3 className='mb-2'>Crie sua conta e faça seu pedido.</h3>
          <h6 className='mb-3'>Acesse sua conta</h6>

          <div className="form-floating">
            <input type="text" onChange={e => setNome(e.target.value)} className="form-control" placeholder="Nome completo" />
            <label htmlFor="floatingInput">Nome completo</label>
          </div>

          <div className="form-floating">
            <input type="email" onChange={e => setEmail(e.target.value)} className="form-control" placeholder="name@example.com" />
            <label htmlFor="floatingInput">E-mail</label>
          </div>


          <div className="row">
            <div className="col-lg-6">
              <div className="form-floating">
                <input type="password" onChange={e => setSenha(e.target.value)} className="form-control" placeholder="Senha" />
                <label htmlFor="floatingInput">Senha</label>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-floating">
                <input type="password" onChange={e => setSenha2(e.target.value)} className="form-control" placeholder="confirme a senha" />
                <label htmlFor="floatingInput">Confirme sua senha</label>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-8">
              <div className="form-floating">
                <input type="text" onChange={e => setEndereco(e.target.value)} className="form-control" placeholder="Endereço" />
                <label htmlFor="floatingInput">Endereço</label>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="form-floating">
                <input type="text" onChange={e => setComplemento(e.target.value)} className="form-control" placeholder="Compl." />
                <label htmlFor="floatingInput">Complemento</label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="form-floating">
                <input type="text" onChange={e => setBairro(e.target.value)} className="form-control" placeholder="Bairro" />
                <label htmlFor="floatingInput">Bairro</label>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-control">
               <select onChange={salvarCidade} name="cidade" id="cidade">
                <option value="0000000">Cidade</option>
                {
                  cidades.map(c => {
                    return(
                      <option value={c.cod_cidade} key={c.cod_cidade}>{c.cidade} - {c.uf}</option>
                    )
                  })
                }
               </select>
              </div>
            </div>
          </div>

          <div className="form-floating">
            <input type="text" onChange={e => setCep(e.target.value)} className="form-control mb-2" placeholder="CEP." />
            <label htmlFor="floatingInput">CEP.</label>
          </div>

          <button onClick={handleCadastro} className='w-100 btn btn-lg btn-danger mb-2' disabled={loading}>
            {
              loading ? 
            <div>
              <span className="spinner-border spinner-border-sm text-light" role="status"></span> 
              <span className="ms-2">Enviando...</span>
            </div> : 'Criar Conta'
            }
          </button>

          {
            menssagem.length > 0 ? <div className="alert alert-danger mt-2">{menssagem}</div> : null
          }

          <div className='mt-3'>
            <Link to='/login'>Já possui conta? Entre agora!</Link>
          </div>

          {
            menssagem.length > 0 ? null :  <img className='mt-3' src={Logo} alt="Devilery Mais" />
          }
         

        </form>
      </div>

      <div className="col-sm-6 px-0 d-none d-sm-block">
        <img className='background-cadastro' src={Background} alt="Delivery" />
      </div>
    </div>
  )
}