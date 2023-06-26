import './style.css'



export default function Footer(){
  const year = new Date().getFullYear()
  return(
    <div className="row col-12 footer border-top mt-5">
      <div className='col-12 mt-4'>
        <p className='copyright text-center ms-2'> Copyright @ {year} Gransottodev - Todos os direitos Reservados</p>
      </div>
    </div>
  )
}