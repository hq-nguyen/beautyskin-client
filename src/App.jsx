import { ToastContainer } from 'react-toastify';
import './App.css'
import Routers from './routes/Routers';
import ScrollTop from './components/ScrollTop/ScrollTop';


const App = () => {

  return (
    <div>
      <ScrollTop />
      <ToastContainer />
      <Routers />
    </div>

  )
}

export default App;