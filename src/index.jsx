import React from 'react';
import ReactDOM from 'react-dom/client';
import Rotas from  './routes'
import {CartProvider} from './contexts/cart-context'
import './styles/global.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <Rotas/>
  </CartProvider>
);
