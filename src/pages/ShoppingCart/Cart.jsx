import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart, addToCart, reducerCart } from "../../redux/features/cartSlice";
import { assets } from '../../assets/frontend_assets/assets';
import { IoIosArrowRoundBack } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { MdWarning } from "react-icons/md";

const ShoppingCart = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart?.listItem || []);
  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);
  const originalTotalPrice = useSelector((state) => state.cart?.originalTotalPrice || 0);
  const dispatch = useDispatch();

  // Check if any product has quantity less than 3
  const hasInvalidQuantityProducts = cart.some(product => (product.quantity || 1) > 3);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  const showDeleteConfirm = (id) => {
    setItemToDelete(id);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      dispatch(removeFromCart(itemToDelete));
    }
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const handleCheckout = () => {
    if (hasInvalidQuantityProducts) {
      setIsCheckoutModalVisible(true);
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center">
          <p>Vui lòng đăng nhập để xem giỏ hàng</p>
          <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center text-gray-600 hover:text-[#d90429] mb-6">
        <a href="/" className="hover:opacity-80">Trang chủ</a>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Giỏ hàng</span>
      </div>

      <h1 className="text-2xl text-[#d90429] font-medium mb-4">Giỏ hàng ({totalQuantity} sản phẩm)</h1>
      <button
        onClick={() => dispatch(clearCart())}
        className="bg-[#EE1F5B] hover:opacity-85 text-sm mb-4 py-2 px-4 text-white rounded"
      >
        Xóa giỏ hàng
      </button>
      
      {cart.length === 0 ? (
        <div className="text-center pb-10">
          <img src={assets.empty_cart} alt="Empty cart" className="w-1/5 mx-auto" />
          <h2 className='text-rose-600'>Giỏ hàng của bạn đang trống</h2>
          <button 
            onClick={() => navigate('/shop')} 
            className="mt-4 text-blue-600 hover:text-rose-600 hover:underline"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            {hasInvalidQuantityProducts && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4 flex items-center">
                <MdWarning className="h-5 w-5 mr-2 text-yellow-600" />
                <span>Một số sản phẩm trong giỏ hàng của bạn có số lượng lớn hơn 3. Vui lòng điều chỉnh số lượng để tiếp tục đặt hàng.</span>
              </div>
            )}
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr className="text-left">
                  <th className="pb-4 font-normal text-[0.8rem] pl-4">Sản phẩm</th>
                  <th className="pb-4 font-normal text-[0.8rem] text-right">Giá tiền</th>
                  <th className="pb-4 font-normal text-[0.8rem] text-center">Số lượng</th>
                  <th className="pb-4 font-normal text-[0.8rem] text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((product) => {
                  const isInvalidQuantity = (product.quantity || 1) > 3;
                  return (
                    <tr key={product.id} className={`border-b border-gray-200 ${isInvalidQuantity ? 'bg-yellow-50' : ''}`}>
                      <td className="py-4 pl-2">
                        <div className="flex">
                          <img src={product.image} alt={product.name} className="w-24 h-20 object-contain mr-2" />
                          <div>
                            <div className="font-medium text-sm w-80">{product.name}</div>
                            {isInvalidQuantity && (
                              <div className="text-yellow-600 text-xs flex items-center mt-1">
                                <MdWarning className="h-4 w-4 mr-1" />
                                Sản phẩm chỉ được mua tối đa là 3
                              </div>
                            )}
                            <div className="flex space-x-2 text-sm mb-2 mt-1">
                              <button className="flex items-center text-gray-600 hover:text-rose-600">
                                <CiHeart className="h-4 w-4 mr-1" />
                                Yêu thích
                              </button>
                              <button
                                className="flex items-center text-gray-600 hover:text-rose-600"
                                onClick={() => showDeleteConfirm(product.id)}
                              >
                                <MdClear className="h-4 w-4 mr-1" />
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="font-medium text-sm whitespace-nowrap">{(product.price || 0).toLocaleString()} đ</div>
                        <div className="text-sm text-gray-500 line-through whitespace-nowrap">{(product.originalPrice || 0).toLocaleString()} đ</div>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-center items-center border border-gray-300 rounded w-24 mx-auto">
                          <button
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                            onClick={() => dispatch(reducerCart(product))}
                          >
                            -
                          </button>
                          <span className="px-2">{product.quantity || 1}</span>
                          <button
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                            onClick={() => dispatch(addToCart(product))}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 pr-2 text-right font-medium text-sm whitespace-nowrap">
                        {((product.price || 0) * (product.quantity || 1)).toLocaleString()} đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="lg:hidden mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span>Tạm tính:</span>
                <span className="font-medium text-sm whitespace-nowrap">{originalTotalPrice.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Giảm giá:</span>
                <span className="whitespace-nowrap">-0 đ</span>
              </div>
              <div className="flex justify-between mb-4 font-medium text-sm">
                <span>Tổng cộng:</span>
                <span className="text-orange-500 whitespace-nowrap">{originalTotalPrice.toLocaleString()} đ</span>
              </div>
              <div className="text-sm text-gray-500 mb-4 text-right">(Đã bao gồm VAT)</div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#EE1F5B] hover:opacity-80 text-white font-medium py-3 rounded"
              >
                Tiến hành đặt hàng
              </button>
            </div>
            <div className="mt-6">
              <button 
                onClick={() => navigate('/shop')} 
                className="flex items-center text-rose-600 hover:text-rose-500"
              >
                <IoIosArrowRoundBack className="text-2xl" />
                Tiếp tục mua hàng
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/3 hidden lg:block">
            <div className="border border-gray-200 rounded p-6">
              <h2 className="text-xl font-medium mb-4">Hóa đơn của bạn</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-medium whitespace-nowrap">{originalTotalPrice.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá:</span>
                  <span className="whitespace-nowrap">-0 đ</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
                  <span>Tổng cộng:</span>
                  <span className="text-orange-500 text-xl whitespace-nowrap">{originalTotalPrice.toLocaleString()} đ</span>
                </div>
                <div className="text-sm text-gray-500 text-right">(Đã bao gồm VAT)</div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#EE1F5B] hover:opacity-80 text-white font-medium py-3 rounded"
              >
                Tiến hành đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-medium mb-4">Xác nhận xóa</h3>
            <p className="mb-6">Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Warning Modal */}
      {isCheckoutModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <div className="flex items-center justify-center mb-4 text-yellow-500">
              <MdWarning className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-medium mb-4 text-center">Không thể tiến hành đặt hàng</h3>
            <p className="mb-6 text-center">Giỏ hàng của bạn có sản phẩm không đạt số lượng yêu cầu</p>
            <div className="flex justify-center">
              <button
                onClick={() => setIsCheckoutModalVisible(false)}
                className="px-6 py-2 bg-[#EE1F5B] text-white rounded hover:opacity-85"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;