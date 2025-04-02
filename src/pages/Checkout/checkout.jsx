import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { applyPromotion, clearCart } from "../../redux/features/cartSlice";
import api from '../../config/axios';
import { createOrder, createOrderCOD } from '../../apis/order';
import { message } from 'antd';
import ProductList from './ProductListCart';
import PromotionSection from './PromotionSection';
import OrderSummary from './OrderSumary';
import PaymentMethodSelector from './PaymentMethod';
import ShippingAddressSelector from './ShippingAddressSelector';
import { getAllPromotions } from '../../apis/promotion';

const CheckoutPage = () => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [promotionCode, setPromotionCode] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState(null);

  // Redux state
  const cart = useSelector((state) => state.cart?.listItem || []);
  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);
  const totalPrice = useSelector((state) => state.cart?.totalPrice || 0);
  const dispatch = useDispatch();
  const originalTotalPrice = useSelector((state) => state.cart?.originalTotalPrice || 0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      fetchUserAddresses();
    } else {
      navigate('/login');
    }

    setLoading(false);
  }, [navigate]);

  const fetchUserAddresses = async () => {
    try {
      const userId = localStorage.getItem('id');
      const response = await api.get(`address/getByUser/${userId}`);

      if (response.data && Array.isArray(response.data)) {
        setAddresses(response.data);

        const defaultAddr = response.data.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (response.data.length > 0) {
          setSelectedAddressId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Error fetching address data");
    }
  };

  const applyCoupon = async () => {
    if (!promotionCode.trim()) {
      message.error('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      const promotions = await getAllPromotions();
      const promotionDetails = promotions.find(promo =>
        promo.name.toUpperCase() === promotionCode.toUpperCase()
      );

      if (!promotionDetails) {
        message.error('Mã giảm giá không hợp lệ');
        return;
      }

      const now = new Date();
      const startDate = new Date(promotionDetails.startDate);
      const endDate = new Date(promotionDetails.endDate);

      if (now < startDate || now > endDate) {
        message.error('Mã giảm giá chưa có hiệu lực hoặc đã hết hạn');
        return;
      }

      if (originalTotalPrice < promotionDetails.orderPrice) {
        message.error(`Đơn hàng tối thiểu để áp dụng mã này là ${promotionDetails.orderPrice.toLocaleString()} đ`);
        return;
      }

      // Apply promotion to cart
      dispatch(applyPromotion({
        code: promotionCode,
        amount: promotionDetails.promoAmount,
        details: promotionDetails
      }));

      setAppliedPromotion(promotionDetails);
      message.success('Áp dụng mã giảm giá thành công!');

    } catch (error) {
      console.error('Error applying promotion:', error);
      message.error('Đã xảy ra lỗi khi kiểm tra mã giảm giá');
    }
  };

  const removeAppliedPromotion = () => {
    dispatch(applyPromotion(null));
    setAppliedPromotion(null);
    setPromotionCode('');
  };

  const finalTotalPrice = Math.max(
    originalTotalPrice - (appliedPromotion ? appliedPromotion.promoAmount : 0),
    0
  );

  const calculateTotalDiscount = () => {
    const productDiscounts = cart.reduce((sum, product) => {
      return sum + ((product.originalPrice || product.price) - product.price) * product.quantity;
    }, 0);

    const promotionDiscount = appliedPromotion ? appliedPromotion.promoAmount : 0;

    return productDiscounts + promotionDiscount;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      message.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    if (!agreeToTerms) {
      message.error('Vui lòng đồng ý với điều khoản giao dịch');
      return;
    }

    const orderData = {
      details: cart.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
      })),
      promold: appliedPromotion ? appliedPromotion.id : null
    };

    try {
      if (paymentMethod === 'cod') {
        const payload = await createOrderCOD(orderData);
        console.log("COD order created:", payload);
        dispatch(clearCart());
        navigate('/checkout/confirmCOD');
      } else {
        const payload = await createOrder(orderData);
        console.log("Payment redirect URL:", payload);
        window.location.href = payload;
        dispatch(clearCart());
      }
    } catch (error) {
      console.error("Error creating order:", error);
      message.error('Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.');
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto p-4">Loading...</div>;
  if (!isLoggedIn) return <div>Please log in</div>;
  if (cart.length === 0) return <div>Your cart is empty</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      <div className="flex items-center text-gray-600 mb-6">
        <Link to="/" className="hover:opacity-80 hover:text-[#d90429]">Trang chủ</Link>
        <span className="mx-2">›</span>
        <Link to="/checkout/cart" className="hover:opacity-80 hover:text-[#d90429]">Giỏ hàng</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Thanh toán</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-medium text-[#d90429] mb-4">
            Giỏ hàng của bạn ({totalQuantity} sản phẩm)
          </h1>

          <ProductList cart={cart} />

          <PromotionSection
            promotionCode={promotionCode}
            setPromotionCode={setPromotionCode}
            appliedPromotion={appliedPromotion}
            applyCoupon={applyCoupon}
            removeAppliedPromotion={removeAppliedPromotion}
            setAppliedPromotion={setAppliedPromotion}
            originalTotalPrice={originalTotalPrice} 
          />

          <OrderSummary
            totalPrice={finalTotalPrice}
            originalTotalPrice={originalTotalPrice}  // Pass original total price
            totalQuantity={totalQuantity}
            totalDiscount={appliedPromotion ? appliedPromotion.promoAmount : 0}
          />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <div className="mt-8 flex flex-col items-start">
            <div className="flex items-start mb-4">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 mr-2"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
              />
              <label htmlFor="terms" className="text-gray-700">
                Tôi đã đọc và đồng ý với <Link to={'/support/payment'} className="text-rose-600 hover:text-rose-700 hover:underline">điều kiện giao dịch chung</Link> của website
              </label>
            </div>

            <button
              className={`bg-[#EE1F5B] text-white py-3 px-6 rounded text-lg font-medium ${!agreeToTerms || !selectedAddressId ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={handlePlaceOrder}
            >
              Đặt hàng
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 lg:w-96">
          <ShippingAddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            handleAddressSelect={setSelectedAddressId}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;