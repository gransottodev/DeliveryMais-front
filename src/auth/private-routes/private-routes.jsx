import { Navigate } from "react-router-dom"

export function PrivateRoutes(props){
  const isAuthenticated = localStorage.getItem('sessionToken') ? true : false
    return isAuthenticated ? props.children : <Navigate to={'/login'}/>
}