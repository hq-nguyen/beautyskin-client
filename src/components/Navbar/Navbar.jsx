import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { message } from 'antd';
import { assets } from '../../assets/frontend_assets/assets';
import { IoIosLogIn } from "react-icons/io";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { CiUser, CiHeart } from "react-icons/ci";
import api from '../../apis/product';
import { logout } from '../../redux/features/useSlice';
import { clearCart } from '../../redux/features/cartSlice';
import { formatCurrency } from '../../utils/format';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);
  

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    message.success("Đã đăng xuất");
    // toast.success('Đăng xuất thành công');
    navigate('/');
  };

  const handleSearchInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query)

    if (query.trim()) {
      try {
        const response = await api.get(`/product/getByName?name=${query}`)

        const validResults = response.data.filter(product => product.id && !isNaN(product.id))
        setSearchResult(validResults)
      } catch (error) {
        console.error("Error fetching search results:", error)
        setSearchResult([])
        toast.error('Không tìm thấy sản phẩm')
      }
    } else {
      setSearchResult([])
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await api.get(`/product/getByName?name=${searchQuery}`);
      // Lọc sản phẩm có id hợp lệ
      const filteredProducts = response.data.filter(product => product.id && !isNaN(product.id));

      localStorage.setItem('searchQuery', searchQuery);
      localStorage.setItem('filteredProducts', JSON.stringify(filteredProducts));

      navigate('/shop');
      setSearchResult([]);
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error('Không thể tìm kiếm sản phẩm. Vui lòng thử lại.');
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResult([])
  };

  const handleWishlistClick = () => {
    if (user) {
      navigate('/user/wishlist');
    } else {
      toast.info('Vui lòng đăng nhập để xem danh sách yêu thích của bạn');
      navigate('/login');
    }
  };

  return (
    <div className='navbar sticky top-0 z-50 bg-white shadow-md'>
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
        <div className="hidden md:block max-w-xs w-full px-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center rounded-full border border-gray-300 bg-gray-100 overflow-hidden pl-4 pr-2 py-2">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                className="bg-transparent outline-none flex-grow text-gray-600"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 mr-1"
                >
                  <IoCloseOutline size={20} />
                </button>
              )}
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
              <button
                type="submit"
                className="rounded-full p-1"
              >
                <IoSearchOutline size={20} className="text-gray-500" />
              </button>
            </div>
          </form>
          {searchResult.length > 0 && (
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10 bg-white border border-gray-300 rounded-lg mt-2 max-h-108 overflow-y-auto shadow-lg">
              {searchResult.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex items-center p-3 hover:bg-gray-100"
                  onClick={() => setSearchResult([])}
                >
                  <img
                    src={product?.images[0]?.url || assets.da_dau}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div>
                    <p className="text-gray-700 text-sm">{product.name}</p>
                    <p className="text-orange-500 font-bold text-sm">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className='flex items-center gap-4'>
          <div
            onClick={handleWishlistClick}
            className='cursor-pointer relative group'
          >
            <CiHeart className='w-[1.6rem] h-[2rem]' />
            <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded py-1 px-2 -left-8 -bottom-8 transition-opacity duration-300 whitespace-nowrap">
              Danh sách yêu thích
            </div>
          </div>
          {user ? (
            <div className='group relative'>
              <CiUser className='w-[1.6rem] h-[2rem] cursor-pointer' />
              <div className='absolute z-100 hidden right-0 pt-4 group-hover:block'>
                {user.roleEnum === "MANAGER" ? (
                  <div className='dropdown-menu-box flex flex-col gap-1 w-36 py-2 px-2 bg-white text-gray-500 rounded shadow-lg'>
                    <>
                      <div>
                        <Link to='/admin' className='block cursor-pointer hover:text-white py-1 px-2 hover:bg-rose-600 rounded-sm duration-300'>
                          Dashboard
                        </Link>
                      </div>
                      <div>
                        <button
                          onClick={handleLogout}
                          className='w-full text-left cursor-pointer hover:text-white py-1 px-2 hover:bg-rose-600 rounded-sm duration-300'
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  </div>

                ) : (
                  <div className='dropdown-menu-box flex flex-col gap-1 w-48 py-2 px-2 bg-white text-gray-500 rounded shadow-lg'>
                    <>
                      <div>
                        <Link to='/user' className='block cursor-pointer hover:text-white hover:bg-rose-600 px-2 py-1 rounded-sm duration-300'>
                          Thông tin tài khoản
                        </Link>
                      </div>
                      <div>
                        <Link to='/user/manage-order' className='block cursor-pointer hover:text-white hover:bg-rose-600 px-2 py-1 rounded-sm duration-300'>
                          Xem đơn hàng
                        </Link>
                      </div>
                      <div>
                        <Link to='/user/wishlist' className='block cursor-pointer hover:text-white hover:bg-rose-600 px-2 py-1 rounded-sm duration-300'>
                          Danh sách yêu thích
                        </Link>
                      </div>
                      <div>
                        <button
                          onClick={handleLogout}
                          className='w-full text-left cursor-pointer hover:text-white hover:bg-rose-600 px-2 py-1 rounded-sm duration-300'
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='group relative'>
              <IoIosLogIn className='w-[1.6rem] h-[2rem] cursor-pointer' />
              <div className='absolute z-100 hidden right-0 pt-4 group-hover:block'>
                <div className='dropdown-menu-box flex flex-col gap-2 w-36 py-1 px-2 bg-white text-gray-500 rounded'>
                  <Link to='/login' className='login-section cursor-pointer hover:text-white hover:bg-rose-500 px-2 py-1 duration-150'>Đăng nhập</Link>
                  <Link to='/register' className='register-section cursor-pointer hover:text-white hover:bg-rose-500 px-2 py-1 duration-150'>Đăng ký</Link>
                </div>
              </div>
            </div>
          )}
          <Link to='/checkout/cart' className='relative'>
            <img
              src={assets.cart_icon}
              className='w-5 min-w-5'
              alt=""
            />
            <p className='absolute right-[-8px] top-[-5px] w-4 text-center leading-4 bg-red-600 text-white aspect-square rounded-full text-[8px]'>
              {totalQuantity}
            </p>
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
          {user && (
            <NavLink onClick={() => setVisible(false)} className='text-primary py-2 pl-5 border' to='/user/wishlist'>Danh sách yêu thích</NavLink>
          )}
          {user && user.roleEnum === "MANAGER" && (
            <NavLink onClick={() => setVisible(false)} className='text-primary py-2 pl-5 border' to='/dashboard'>Dashboard</NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;