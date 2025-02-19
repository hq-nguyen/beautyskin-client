import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { assets } from '../../assets/frontend_assets/assets'
import './Navbar.css'

const Navbar = () => {

  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className='navbar sticky top-0 z-40 flex items-center justify-between py-5 font-medium px-4 lg:px-[9vw]'>
        <Link to='/'>
          <img src={assets.logo} className='w-36' alt="" />

        </Link>
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to='/about' className='navbar-link flex flex-col items-center gap-1'>
            <p>Giới thiệu</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/shop' className='navbar-link flex flex-col items-center gap-1'>
            <p>Mua hàng</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/blog' className='navbar-link flex flex-col items-center gap-1'>
            <p>Blog</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/news' className='navbar-link flex flex-col items-center gap-1'>
            <p>Tin tức</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/test' className='navbar-link flex flex-col items-center gap-1'>
            <p>Trắc nghiệm loại da</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>

        </ul>

        <div className='flex items-center gap-6'>
          <img src={assets.wishlist_icon} className='w-5 cursor-pointer' alt="" />
          <img src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

          <div className='group relative'>
            <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
            <div className='absolute dropdown-menu hidden right-0 pt-4 group-hover:block'>
              <div className='dropdown-menu-box flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded'>
                <Link to='/login' className='login-section cursor-pointer hover:text-white'>Đăng nhập</Link>
                <Link to='/register' className='register-section cursor-pointer hover:text-white'>Đăng ký</Link>
              </div>
            </div>
          </div>
          <Link to='/cart' className='relative'>
            <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
            <p className='absolute right-[-8px] top-[-5px] w-4 text-center leading-4 bg-red-600 text-white aspect-square rounded-full text-[8px]'>10</p>
          </Link>

          <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
        </div>
      </div>

      {/* Sidebar menu for small screens */}
      {/* Overlay for small screens */}
      {visible && (
        <div className="overlay" onClick={() => setVisible(false)} />
      )}

      {/* Sidebar menu for small screens */}
      <div className={`sidebar ${visible ? 'visible' : 'hidden'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 text-primary cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
            <p>Đóng</p>
          </div>
          {/* Sidebar Links */}
          <NavLink onClick={() => setVisible(false)} className='text-primary py-2 pl-5 border' to='/'>Trang chủ</NavLink>
          <NavLink onClick={() => setVisible(false)} className='text-primary py-2 pl-5 border' to='/shop'>Mua hàng</NavLink>
          <NavLink onClick={() => setVisible(false)} className='text-primary py-2 pl-5 border' to='/about'>Về chúng tôi</NavLink>
          <NavLink onClick={() => setVisible(false)} className='text-primary py-2 pl-5 border' to='/contact'>Liên hệ</NavLink>
        </div>
      </div>
    </div>


  )
}

export default Navbar