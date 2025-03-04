import './App.css'
import { ProductProvider } from './contexts/ProductContext';
import Routers from './routes/Routers';
import ScrollTop from './utils/ScrollTop';
import { ToastContainer } from 'react-toastify'


const App = () => {

  return (
    <div>
      <ProductProvider>
        <div>
          <ScrollTop />
          <ToastContainer />
          <Routers />
        </div>
      </ProductProvider>

    </div>
  )
}

export default App
