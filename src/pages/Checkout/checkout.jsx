import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../redux/features/cartSlice";
import api from '../../config/axios';
import { createOrder } from '../../apis/order';

const CheckoutPage = () => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'direct'
  const [error, setError] = useState('');
  const [tempName, setTempName] = useState('');
  const [user, setUser] = useState({
    fullName: '',
  });
  const [couponCode, setCouponCode] = useState('');

  // Get cart from Redux store
  const cart = useSelector((state) => state.cart?.listItem || []);
  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);
  const totalPrice = useSelector((state) => state.cart?.totalPrice || 0);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      fetchUserData();
      fetchAddresses();
    } else {
      navigate('/login');
    }

    setLoading(false);
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const response = await api.get("get");
      const userData = response.data.find(item => item.id == localStorage.getItem('id'));
      if (userData) {
        const { fullName } = userData;
        setUser({
          fullName
        });
        setTempName(fullName);
      } else {
        console.log("User not found!");
        setError("User not found!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      setError("Error fetching user data");
    }
  };

  const fetchAddresses = async () => {
    try {
      const userId = localStorage.getItem('id');
      const response = await api.get(`address/getByUser/${userId}`);

      if (response.data && Array.isArray(response.data)) {
        setAddresses(response.data);

        const defaultAddr = response.data.find(addr => addr.isDefault);
        if (defaultAddr) {
          setDefaultAddress(defaultAddr);
          setSelectedAddressId(defaultAddr.id);
        } else if (response.data.length > 0) {
          setSelectedAddressId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ người dùng:", error);
      setError("Error fetching address data");
    }
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      dispatch(removeFromCart(productToDelete));
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }
    setShowConfirmDelete(false);
    setProductToDelete(null);
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    // In a real application, you would make an API call to validate the coupon
    toast.info('Đang áp dụng mã giảm giá...');
    setTimeout(() => {
      toast.success('Đã áp dụng mã giảm giá thành công');
    }, 1000);
  };

  const calculateTotalDiscount = () => {
    return cart.reduce((sum, product) => {
      return sum + ((product.originalPrice || product.price) - product.price) * product.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    if (!agreeToTerms) {
      toast.error('Vui lòng đồng ý với điều khoản giao dịch');
      return;
    }

    // In a real application, you would make an API call to create the order
    // For now, we'll just navigate to a confirmation page
    if (paymentMethod === 'cod') {
      navigate('/checkout/confirmCOD');
    } else {
      const orderData = {
        details: cart.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
        })),
      };
      const payload = await createOrder(orderData);
      window.location.href = payload;
      console.log(payload);
      
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
          <p>Vui lòng đăng nhập để tiến hành thanh toán</p>
          <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-10">
          <p>Giỏ hàng của bạn đang trống</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center text-gray-600  mb-6">
        <a href="/" className="hover:opacity-80 hover:text-[#d90429]">Trang chủ</a>
        <span className="mx-2">›</span>
        <a href="/checkout/cart" className="hover:opacity-80 hover:text-[#d90429]">Giỏ hàng</a>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Thanh toán</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Cart Column */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium text-[#d90429] mb-4">Giỏ hàng của bạn ({totalQuantity} sản phẩm)</h1>

          <div className="border-t border-b border-gray-200 py-3 mb-4 text-sm">
            <p className="text-red-600">
              Đơn hàng từ <span className="font-bold">300k</span> bạt ký tặng <span className="font-bold">1 Mini Size Ceuticoz</span>.
              Đơn từ <span className="font-bold">500k</span> tặng <span className="font-bold">1 Body Silicone Bath Brush 177k</span>.
              Đơn từ <span className="font-bold">1 triệu</span> tặng <span className="font-bold">1 áo thun BST VN Coolmate</span> trị giá <span className="font-bold">350k</span>
            </p>
          </div>

          {/* Products */}
          {cart.map((product) => (
            <div key={product.id} className="flex flex-col md:flex-row border-b border-gray-200 py-4">
              <div className="flex mb-4 md:mb-0">
                <img src={product.image} alt={product.name} className="w-24 h-20 object-cover mr-2" />
                <div className="flex-1">
                  {/* <h2 className="font-medium text-sm w-80">{product.category?.name}</h2> */}
                  <h3 className="font-medium text-sm w-80">{product.name}</h3>
                </div>
              </div>
              <div className="md:ml-auto text-right mt-4 md:mt-0">
                <div className="flex flex-col items-end">
                  <span className="text-red-600 text-sm font-normal">{product.quantity || 1} x {product.price.toLocaleString()} đ</span>
                  <span className="text-red-600 font-semibold"><span className='text-gray-500 font-normal'>Tổng:</span> {totalPrice.toLocaleString()} đ</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div>
                      <span className="text-gray-500 line-through text-sm"> {product.originalPrice.toLocaleString()} đ</span>
                      <span className="ml-2 bg-red-600 text-white px-1 text-xs">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                  <span className="text-gray-500 text-sm mt-1">(Giá đã bao gồm VAT)</span>
                </div>
              </div>
            </div>
          ))}

          {/* Gifts - based on order total */}
          {totalPrice >= 300000 && (
            <div className="border border-red-200 rounded p-4 mt-6 bg-red-50">
              <h3 className="text-red-700 font-medium flex items-center mb-2">
                <span className="mr-2">🎁</span> Quà tặng
              </h3>
              <ul className="pl-4">
                {totalPrice >= 1000000 && (
                  <li className="text-gray-700 list-disc ml-4">1 áo thun BST VN Coolmate (350.000 đ)</li>
                )}
                {totalPrice >= 500000 && (
                  <li className="text-gray-700 list-disc ml-4">1 Body Silicone Bath Brush (177.000 đ)</li>
                )}
                {totalPrice >= 300000 && (
                  <li className="text-gray-700 list-disc ml-4">1 Mini Size Ceuticoz</li>
                )}
              </ul>
            </div>
          )}

          {/* Coupon Code */}
          <div className="mt-8">
            <div className="flex mb-2">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                className="flex-1 border border-gray-300 rounded-l p-2"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                className="bg-[#EE1F5B] text-white px-4 py-2 rounded-r uppercase text-sm font-medium"
                onClick={applyCoupon}
              >
                Áp dụng
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-1">- Sau khi áp dụng, Mã giảm giá có thể không dùng được trong vòng 15 phút.</p>
            <p className="text-gray-600 text-sm">- Trong quá trình thanh toán, chúng tôi sẽ tạm khóa mã giảm giá của quý khách để đảm bảo phiên giao dịch được ổn định.</p>
            <p className="text-gray-600 text-sm">Mã giảm giá sẽ được mở lại ngay khi phiên giao dịch kết thúc</p>
          </div>

          {/* Loyalty Points */}
          <div className="border border-red-200 rounded p-4 mt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="mb-1">Điểm tích lũy đang có: <span className="font-bold">0 điểm</span>. Tương ứng <span className="font-bold">0 đ</span></p>
                <a href="#" className="text-red-800 text-sm underline">Xem quy định tích lũy điểm</a>
                <p className="text-sm mt-2">Đơn hàng này thành công bạn sẽ tích lũy được <span className="text-red-600 font-bold">{Math.floor(totalPrice / 50000)} điểm</span></p>
              </div>
              <button className="bg-[#EE1F5B] text-white px-4 py-2 rounded uppercase text-sm font-medium">
                Sử dụng
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8">
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Tạm tính:</span>
              <span className="font-bold">{totalPrice.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Giảm giá:</span>
              <span className="text-[#d90429] font-bold">-{calculateTotalDiscount().toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Sử dụng điểm tích lũy:</span>
              <span className="font-bold">-0 đ</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Phí vận chuyển:</span>
              <span className="font-bold">0 đ</span>
            </div>
            <div className="flex justify-between py-4 border-t border-gray-200 mt-2">
              <span className="text-lg font-medium">Tổng giá trị đơn hàng:</span>
              <span className="text-xl font-bold text-[#d90429]">{totalPrice.toLocaleString()} đ</span>
            </div>
          </div>
          <hr />
          {/* Payment Method */}
          <div className="mt-8">
            <h2 className="text-xl font-medium text-[#d90429] mb-4">Phương thức thanh toán</h2>
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`border rounded ${paymentMethod === 'cod' ? 'bg-blue-500 text-white' : 'bg-gray-200'} p-4 flex flex-col items-center justify-center cursor-pointer`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                    <span className="text-gray-600">👤</span>
                  </div>
                  <span className="text-center text-sm">Thanh toán khi nhận hàng</span>
                </div>
                <div
                  className={`border rounded ${paymentMethod === 'direct' ? 'bg-blue-500 text-white' : 'bg-gray-200'} p-4 flex flex-col items-center justify-center cursor-pointer`}
                  onClick={() => setPaymentMethod('direct')}
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                    <span className="text-gray-600">📱</span>
                  </div>
                  <span className="text-center text-sm">Chuyển khoản trực tiếp</span>
                </div>
              </div>

              <div className="border rounded p-4 mt-6">
                <h3 className="font-medium text-[#d90429] mb-2">
                  {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản trực tiếp'}
                </h3>
                {paymentMethod === 'cod' ? (
                  <p className="text-gray-700">Quý khách sẽ thanh toán bằng <span className="font-medium">tiền mặt</span> khi đơn vị vận chuyển giao hàng tận nơi.</p>
                ) : (
                  <p className="text-gray-700">Thanh toán bằng cách chuyển khoản trực tiếp.</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms and Checkout */}
          <div className="mt-8 flex flex-col items-start">
            <div className="flex items-start mb-4">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 mr-2"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
              />
              <label htmlFor="terms" className="text-gray-700">Tôi đã đọc và đồng ý với <span className="text-red-800">điều kiện giao dịch chung</span> của website</label>
            </div>

            <button
              className={`bg-[#EE1F5B] text-white py-3 px-6 rounded text-lg font-medium ${!agreeToTerms || !selectedAddressId ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={handlePlaceOrder}
            >
              Đặt hàng
            </button>
          </div>
        </div>

        {/* Shipping Info Column */}
        <div className="w-full md:w-80 lg:w-96">
          <div className="bg-white rounded border border-gray-200 p-4">
            <h2 className="text-xl font-medium text-red-800 mb-4">Thông tin nhận hàng</h2>

            <div className="mb-4">
              {/* Display fetched addresses */}
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <div className="flex items-center mb-4" key={address.id}>
                    <input
                      type="radio"
                      id={`address-${address.id}`}
                      name="address"
                      className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      checked={selectedAddressId === address.id}
                      onChange={() => handleAddressSelect(address.id)}
                    />
                    <div>
                      <p className="font-medium">{address.name}</p>
                      <p className="text-gray-600">{address.address}</p>
                      <p className="text-gray-600">{address.ward}, {address.district}, {address.province}</p>
                      <p className="text-gray-600">{address.phone}</p>
                      {address.isDefault && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded mt-1 inline-block">Mặc định</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
              )}

              {/* Option to add new address */}
              <button className='bg-[#EE1F5B] text-white px-4 py-2 rounded uppercase text-sm font-medium'>
                <Link to={'/user/manage-address'}>Thêm địa chỉ mới</Link>
              </button>
            </div>

            {/* Order Summary in sidebar for mobile */}
            <div className="mt-6 lg:hidden">
              <h3 className="font-medium mb-3">Tóm tắt đơn hàng</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính ({totalQuantity} sản phẩm):</span>
                  <span>{totalPrice.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá:</span>
                  <span>-{calculateTotalDiscount().toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>0 đ</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                  <span>Tổng cộng:</span>
                  <span className="text-[#d90429]">{totalPrice.toLocaleString()} đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;