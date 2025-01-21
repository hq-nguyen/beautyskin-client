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


        </Routes>
      </div>

    </div>
  )
}

export default App
