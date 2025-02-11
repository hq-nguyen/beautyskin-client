import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Shop from './pages/Shop/Shop'
import About from './pages/About/About'
import Blog from './pages/Blog/Blog'
import News from './pages/News/News'
import TestSkinType from './pages/TestSkinType/TestSkinType'
import Cart from './pages/Cart/Cart'
import Register from './pages/Register/Register'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'
import AccountManagement from './pages/ManageAccount/AccountManagement'
import InfoUser from './pages/InfoUser/InfoUser'
import Address from './pages/Address/Address'
import AddAddress from './pages/AddressForm/AddressForm'
import AddressDefault from './pages/AddressManagement'
import Order from './pages/ManageOrder'

const App = () => {

  return (
    <div>
      <Navbar />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/news' element={<News />} />
          <Route path='/test' element={<TestSkinType />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/user' element={<AccountManagement />} />
          <Route path='/user/info' element={<InfoUser />} />
          <Route path='/user/address' element={<Address />} />
          <Route path='/user/add-address' element={<AddAddress />} />
          <Route path='/user/manage-address' element={<AddressDefault />} />
          <Route path='/user/manage-order' element={<Order />} />
          {/* <Route path='/user/change-password' element={<ChangePassword />} /> */}
          {/* <Route path='*' element={<h1>404 Not Found</h1>} /> */}

        </Routes>
      </div>
      <Footer />
    </div>
    
  )
}

export default App;
