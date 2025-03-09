import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { clearCart, removeFromCart } from "../../redux/features/cartSlice";

const ShoppingCart = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart?.listItem || []);
  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);
  const totalPrice = useSelector((state) => state.cart?.totalPrice || 0);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      
      if (token) {
        await fetchCartItems(token);
      } else {
        dispatch(clearCart());
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  const fetchCartItems = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(`https://67825c10c51d092c3dcf2d8d.mockapi.io/Cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      
      const data = await response.json();
      const formattedData = Array.isArray(data) ? data.map(item => ({
        id: item.id,
        name: item.name || 'Unknown Product',
        description: item.description || '',
        price: item.price || 0,
        originalPrice: item.originalPrice || item.price || 0,
        quantity: item.quantity || 1,
        promo: item.promo || '',
        image: item.image || 'https://via.placeholder.com/80x80'
      })) : [];
      
      dispatch(clearCart());
      formattedData.forEach(item => dispatch({ type: 'cart/addToCart', payload: item }));
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch(clearCart());
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id, increment) => {
    const product = cart.find(item => item.id === id);
    if (product) {
      const newQuantity = Math.max(1, product.quantity + (increment ? 1 : -1));
      dispatch(removeFromCart(id));
      dispatch({
        type: 'cart/addToCart',
        payload: { ...product, quantity: newQuantity }
      });
    }
  };

  const showDeleteConfirm = (id) => {
    setItemToDelete(id);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`https://67825c10c51d092c3dcf2d8d.mockapi.io/Cart/${itemToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        dispatch(removeFromCart(itemToDelete));
      } catch (error) {
        console.error('Error removing product:', error);
      }
    }
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsModalVisible(false);
    setItemToDelete(null);
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

      <h1 className="text-2xl text-[#d90429] font-medium mb-6">Giỏ hàng ({totalQuantity} sản phẩm)</h1>
      <Button
        onClick={() => dispatch(clearCart())}
        type="primary"
        className="bg-[#EE1F5B]"
      >
        Clear Cart
      </Button>
      
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p>Giỏ hàng của bạn đang trống</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 text-blue-600 hover:underline"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr className="text-left">
                  <th className="pb-4 font-medium">Sản phẩm</th>
                  <th className="pb-4 font-medium text-right">Giá tiền</th>
                  <th className="pb-4 font-medium text-center">Số lượng</th>
                  <th className="pb-4 font-medium text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200">
                    <td className="py-4">
                      <div className="flex">
                        <img src={product.image} alt={product.name} className="w-20 h-20 object-contain mr-4" />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-700 mb-2">{product.description}</div>
                          <div className="flex space-x-2 text-sm mb-2">
                            <button className="flex items-center text-gray-600 hover:text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              Yêu thích
                            </button>
                            <button
                              className="flex items-center text-gray-600 hover:text-red-500"
                              onClick={() => showDeleteConfirm(product.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Xóa
                            </button>
                          </div>
                          {product.promo && (
                            <div className="bg-green-100 text-green-800 p-2 text-sm rounded">
                              {product.promo}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="font-medium whitespace-nowrap">{(product.price || 0).toLocaleString()} đ</div>
                      <div className="text-sm text-gray-500 line-through whitespace-nowrap">{(product.originalPrice || 0).toLocaleString()} đ</div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center items-center border border-gray-300 rounded w-24 mx-auto">
                        <button
                          className="px-2 py-1 text-gray-500 hover:text-gray-700"
                          onClick={() => handleQuantityChange(product.id, false)}
                        >
                          -
                        </button>
                        <span className="px-2">{product.quantity || 1}</span>
                        <button
                          className="px-2 py-1 text-gray-500 hover:text-gray-700"
                          onClick={() => handleQuantityChange(product.id, true)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-right font-medium whitespace-nowrap">
                      {((product.price || 0) * (product.quantity || 1)).toLocaleString()} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="lg:hidden mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span>Tạm tính:</span>
                <span className="font-medium whitespace-nowrap">{totalPrice.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Giảm giá:</span>
                <span className="whitespace-nowrap">-0 đ</span>
              </div>
              <div className="flex justify-between mb-4 font-medium">
                <span>Tổng cộng:</span>
                <span className="text-orange-500 whitespace-nowrap">{totalPrice.toLocaleString()} đ</span>
              </div>
              <div className="text-sm text-gray-500 mb-4 text-right">(Đã bao gồm VAT)</div>
            </div>
            <div className="mt-6">
              <button 
                onClick={() => navigate('/')} 
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
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
                  <span className="font-medium whitespace-nowrap">{totalPrice.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá:</span>
                  <span className="whitespace-nowrap">-0 đ</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
                  <span>Tổng cộng:</span>
                  <span className="text-orange-500 text-xl whitespace-nowrap">{totalPrice.toLocaleString()} đ</span>
                </div>
                <div className="text-sm text-gray-500 text-right">(Đã bao gồm VAT)</div>
              </div>
              <Link to={'/checkout'}>
                <button className="w-full bg-[#EE1F5B] hover:opacity-80 text-white font-medium py-3 rounded">
                  Tiến hành đặt hàng
                </button>
              </Link>
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
    </div>
  );
};

export default ShoppingCart;