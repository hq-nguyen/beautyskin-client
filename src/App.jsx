import './App.css'
import Routers from './routes/Routers';
import ScrollTop from './utils/ScrollTop';
import { ToastContainer } from 'react-toastify'


const App = () => {

  return (
    <div>
      <ScrollTop />
      <ToastContainer />
      <Routers />
    </div>
  )
}

export default App
