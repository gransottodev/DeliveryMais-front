import { createContext, useEffect, useState } from "react"
import api from '../services/api'

const CartContext = createContext({})

function CartProvider(props) {

  const [cart, setCart] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [desconto, setDesconto] = useState(0)
  const [entregaCart, setEntregaCart] = useState(0)
  const [id_cupom, setId_cupom] = useState(0)
  const [cupom, setCupom] = useState('')
  const [msg, setMsg] = useState('')
  const [total, setTotal] = useState(0)
  const [idEstabelecimento, setIdEstabelecimento] = useState(0)

  function addItemCart(item) {
    setCart([...cart, item])
    salvarCart([...cart, item])
  }

  function removerItem(id) {
    const newCart = cart.filter((item, index, arr) => {
      return item.id_carrinho != id
    })

    setCart(newCart)
    salvarCart(newCart)
  }

  function salvarCart(produtos){
    if(produtos.length > 0){

      localStorage.setItem('sessionCart', JSON.stringify({
        cupom,
        id_cupom,
        id_estabelecimento: idEstabelecimento,
        entrega: entregaCart,
        itens: produtos
      }))
    } else {
      localStorage.removeItem('sessionCart')
    }
  }

  function validarCupom() {
    setMsg('')
    salvarCart(cart)
    api.get('/v1/cupons/validacao', {
      params: {
        cod_cupom: cupom,
        valor: Math.trunc(subtotal * 100), // Valor em centavos
        id_estabelecimento: idEstabelecimento
      }
    })
      .then(response => {
        if (response.data) {
          let porc_cupom = response.data.porc_cupom
          let vl_cupom = response.data.vl_cupom

          setId_cupom(response.data.id_cupom)
          setDesconto(vl_cupom + (subtotal * porc_cupom / 100))
        } else {
          setId_cupom(0)
          setDesconto(0)
          setMsg('Cupom inválido')
        }
      })
      .catch(error => {
        setId_cupom(0)
        setDesconto(0)
        setMsg('Cupom inválido')
      })
  }

  useEffect(() => {
    let soma = cart.reduce((a, b) => a + (b.vl_unit * b.qtd), 0)
    setSubtotal(soma)
  }, [cart])

  useEffect(() => {
    const data = localStorage.getItem('sessionCart')
    if(data){
      setCart(JSON.parse(data).itens)
      setCupom(JSON.parse(data).cupom)
      setIdEstabelecimento(JSON.parse(data).id_estabelecimento)
      setEntregaCart(JSON.parse(data).entrega)
      setId_cupom(JSON.parse(data).id_cupom)
    }
  }, [])

  useEffect(() => {
    setTotal(subtotal - desconto + entregaCart)
  }, [subtotal, desconto, entregaCart])

  useEffect(() => {
    if(cupom.length > 0){
      validarCupom()
    }
  }, [subtotal])

  useEffect(() => {
    setMsg('')
  }, [cupom])

  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      subtotal,
      setSubtotal,
      desconto,
      setDesconto,
      entregaCart,
      setEntregaCart,
      id_cupom,
      setId_cupom,
      total,
      setTotal,
      idEstabelecimento,
      setIdEstabelecimento,
      cupom,
      setCupom,
      msg,
      setMsg,
      addItemCart,
      removerItem,
      validarCupom
    }}>
      {props.children}
    </CartContext.Provider>
  )
}


export { CartContext, CartProvider } 