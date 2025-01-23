import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Blog from './pages/Blog'
import News from './pages/News'
import TestSkinType from './pages/TestSkinType'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Footer from './components/Footer/Footer'

const App = () => {

  return (
    <div>
      <Navbar />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/about' element={<About/>}/>
          <Route path='/shop' element={<Shop/>} />
          <Route path='/blog' element={<Blog/>}/>
          <Route path='/news' element={<News/>}/>
          <Route path='/test' element={<TestSkinType/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          {/* <Route path='*' element={<h1>404 Not Found</h1>} /> */}

        </Routes>
        <Footer />
      </div>

    </div>
  )
}

export default App
