import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { assets } from '../../assets/frontend_assets/assets'
import { logout } from '../../redux/features/useSlice'
import { IoIosLogIn } from "react-icons/io";
import './Navbar.css'

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
      dispatch(logout())
      localStorage.removeItem('token')
      localStorage.removeItem('id')
      toast.success('Đăng xuất thành công')
      navigate('/')
  }

  return (
    <div className='navbar sticky top-0 z-50'>
      <div className='navbar sticky top-0 flex items-center justify-between py-5 font-medium px-4 lg:px-[9vw]'>
        <Link to='/'>
          <img src={assets.logo} className='w-36' alt="" />
        </Link>
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to='/about' className='hover:text-rose-600 duration-150 flex flex-col items-center gap-1'>
            <p>Giới thiệu</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/shop' className='hover:text-rose-600 duration-150 flex flex-col items-center gap-1'>
            <p>Mua hàng</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/blog' className='hover:text-rose-600 duration-150 flex flex-col items-center gap-1'>
            <p>Blog</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/news' className='hover:text-rose-600 duration-150 flex flex-col items-center gap-1'>
            <p>Tin tức</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/test-skin' className='hover:text-rose-600 duration-150 flex flex-col items-center gap-1'>
            <p>Trắc nghiệm loại da</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
        </ul>

        <div className='flex items-center gap-6'>
          <img src={assets.wishlist_icon} className='w-5 cursor-pointer' alt="" />
          <img src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

          {/* Nếu là user thì hiển thị thông tin tài khoản */}
          {user ? (
            <div className='group relative'>
              <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
              <div className='absolute z-100 hidden right-0 pt-4 group-hover:block'>
                <div className='dropdown-menu-box flex flex-col gap-1 w-48 py-2 px-5 bg-white text-gray-500 rounded shadow-lg'>
                  <div>
                    <Link to='/user' className='block cursor-pointer hover:text-rose-600 duration-300'>
                      Thông tin tài khoản
                    </Link>
                  </div>  
                  
                  <div>
                    <button 
                      onClick={handleLogout} 
                      className='w-full text-left cursor-pointer hover:text-rose-600 duration-300'
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='group relative'>
              <IoIosLogIn className='w-[1.6rem] h-[2rem] cursor-pointer' />
              <div className='absolute z-100 hidden right-0 pt-4 group-hover:block'>
                <div className='dropdown-menu-box flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded'>
                  <Link to='/login' className='login-section cursor-pointer hover:text-white hover:bg-rose-500 duration-150'>Đăng nhập</Link>
                  <Link to='/register' className='register-section cursor-pointer hover:text-white hover:bg-rose-500 duration-150'>Đăng ký</Link>
                </div>
              </div>
            </div>
          )}
          
          <Link to='/shopping-cart' className='relative'>
            <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
            <p className='absolute right-[-8px] top-[-5px] w-4 text-center leading-4 bg-red-600 text-white aspect-square rounded-full text-[8px]'>10</p>
          </Link>

          <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
        </div>
      </div>

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