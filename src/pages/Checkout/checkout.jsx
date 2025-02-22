  import { Trash2, X } from 'lucide-react';
  import React, { useState } from 'react';
  import { toast } from "react-toastify";

  const CheckoutPage = () => {
    const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [productToDelete, setProductToDelete] = useState(false)
    const [quantities, setQuantities] = useState({
      product1: 1,
      product2: 1,
      product3: 1
    });

    const updateQuantity = (product, value) => {
      if (value >= 1) {
        setQuantities({...quantities, [product]: value});
      }
    };

    const deleteProduct = (productId) => {
      setProductToDelete(productId)
      setShowConfirmDelete(true)
    }

    const handleConfirmDelete = async () => {
      try {
        const loading = toast.loading('Đang xóa sản phẩm')

        const response = await fetch(`/api/cart/delete/${productToDelete}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Error deleting product')
        }

        const updateQuantity = { ...quantities }
        delete updateQuantity[productToDelete]
        setQuantities(updateQuantity);

        setShowConfirmDelete(false)
        setProductToDelete(null)

        toast.dismiss(loading)
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
      } catch (error) {
        toast.error('Không thể xóa sản phẩm. Vui lòng thử lại sau')
        console.log("Fail to delete product", error);
      }
    }

    const products = [
      {
        id: 'product1',
        name: 'Máy Rửa Mặt Emmié Premium Facial Cleansing Brush Sonic Extra - Đạt Chứng Nhận FDA - Pink',
        price: 945000,
        originalPrice: 945000,
        image: '/api/placeholder/70/70',
        discount: 0
      },
      {
        id: 'product2',
        name: 'Mặt Nạ Microfiber Sung Giúp Mở Nếp Nhăn - Emmié Ficus Microfiber Mask 28gr - Hộp 10 Miếng',
        price: 290000,
        originalPrice: 649000,
        image: '/api/placeholder/70/70',
        discount: 55
      },
      {
        id: 'product3',
        name: 'Mặt Nạ Dưỡng Ẩm Làm Dịu B5 + Peptides Biomecare & Repair Bio-Cellulose Emmié Mask 25g - Combo 1 Hộp',
        price: 309000,
        originalPrice: 590000,
        image: '/api/placeholder/70/70',
        discount: 47
      }
    ];

    const gifts = [
      'Mặt Nạ Dưỡng Ẩm Chuyên Sâu Emmié Complete Hydrating Tencel Mask 23gx2'
    ];

    const calculateTotal = () => {
      return products.reduce((sum, product) => {
        return quantities[product.id] ? sum + (product.price * quantities[product.id]) : sum;
      }, 0);
    };

    const totalDiscount = () => {
      return products.reduce((sum, product) => {
        return quantities[product.id] ? sum + ((product.originalPrice - product.price) * quantities[product.id]) : sum;
      }, 0);
    };

    // Filter products to only show those that haven't been deleted
    const activeProducts = products.filter(product => quantities[product.id]);

    const modalStyle = {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
  };

    return (
      <div className="max-w-6xl mx-auto p-4 font-sans">
        {showConfirmDelete && (
        <div style={modalStyle}>
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
      
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Cart Column */}
          <div className="flex-1">
            <h1 className="text-2xl font-medium text-red-800 mb-4">Giỏ hàng của bạn ( có {Object.values(quantities).reduce((a, b) => a + b, 0)} sản phẩm)</h1>
            
            <div className="border-t border-b border-gray-200 py-3 mb-4 text-sm">
              <p className="text-red-600">
                Đơn hàng từ <span className="font-bold">300k</span> bạt ký tặng <span className="font-bold">1 Mini Size Ceuticoz</span>. 
                Đơn từ <span className="font-bold">500k</span> tặng <span className="font-bold">1 Body Silicone Bath Brush 177k</span>. 
                Đơn từ <span className="font-bold">1 triệu</span> tặng <span className="font-bold">1 áo thun BST VN Coolmate</span> trị giá <span className="font-bold">350k</span>
              </p>
            </div>

            {/* Products */}
            {activeProducts.map((product) => (
              <div key={product.id} className="flex flex-col md:flex-row border-b border-gray-200 py-4">
                <div className="flex mb-4 md:mb-0">
                  <div className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-2" checked readOnly />
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover mr-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <div className="flex items-center mt-4">
                      <button 
                        onClick={() => updateQuantity(product.id, quantities[product.id] - 1)}
                        className="w-8 h-8 border border-gray-300 flex items-center justify-center"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        min="1" 
                        value={quantities[product.id]} 
                        onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                        className="w-12 h-8 border-t border-b border-gray-300 text-center"
                      />
                      <button 
                        onClick={() => updateQuantity(product.id, quantities[product.id] + 1)}
                        className="w-8 h-8 border border-gray-300 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="md:ml-auto text-right mt-4 md:mt-0">
                  <div className="flex flex-col items-end">
                    <span className="text-red-600 font-bold">{product.price.toLocaleString()} đ</span>
                    {product.discount > 0 && (
                      <div>
                        <span className="text-gray-500 line-through text-sm">{product.originalPrice.toLocaleString()} đ</span>
                        <span className="ml-2 bg-red-600 text-white px-1 text-xs">{product.discount}%</span>
                      </div>
                    )}
                    <span className="text-gray-500 text-sm mt-1">(Giá đã bao gồm VAT)</span>
                  </div>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="mt-2 flex items-center gap-2 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-sm">Xóa</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Gifts */}
            {gifts.length > 0 && (
              <div className="border border-red-200 rounded p-4 mt-6 bg-red-50">
                <h3 className="text-red-700 font-medium flex items-center mb-2">
                  <span className="mr-2">🎁</span> Quà tặng
                </h3>
                <ul className="pl-4">
                  {gifts.map((gift, index) => (
                    <li key={index} className="text-gray-700 list-disc ml-4">{gift}</li>
                  ))}
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
                />
                <button className="bg-red-800 text-white px-4 py-2 rounded-r uppercase text-sm font-medium">
                  Áp dụng
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-1">- Sau khi áp dụng, Mã giảm giá có thể không dùng được trong vòng 15 phút.</p>
              <p className="text-gray-600 text-sm">- Trong quá trình thanh toán, Happyskin sẽ tạm khóa mã giảm giá của quý khách để đảm bảo phiên giao dịch được ổn định.</p>
              <p className="text-gray-600 text-sm">Mã giảm giá sẽ được mở lại ngay khi phiên giao dịch kết thúc</p>
            </div>

            {/* Loyalty Points */}
            <div className="border border-red-200 rounded p-4 mt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1">Điểm tích lũy đang có: <span className="font-bold">0 điểm</span>. Tương ứng <span className="font-bold">0 đ</span></p>
                  <a href="#" className="text-red-800 text-sm underline">Xem quy định tích lũy điểm</a>
                  <p className="text-sm mt-2">Đơn hàng này thành công bạn sẽ tích lũy được <span className="text-red-600 font-bold">30 điểm</span></p>
                </div>
                <button className="bg-red-800 text-white px-4 py-2 rounded uppercase text-sm font-medium">
                  Sử dụng
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8">
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Tạm tính:</span>
                <span className="font-bold">{calculateTotal().toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Giảm giá:</span>
                <span className="text-red-600 font-bold">-{totalDiscount().toLocaleString()} đ</span>
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
                <span className="text-xl font-bold text-red-800">1.544.000 đ</span>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="mt-8">
              <h2 className="text-xl font-medium text-red-800 mb-4">Phương thức vận chuyển</h2>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center">
                  <input type="radio" id="free-shipping" name="shipping" className="mr-2" checked readOnly />
                  <label htmlFor="free-shipping" className="font-medium">Free (0 đ)</label>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-8">
              <h2 className="text-xl font-medium text-red-800 mb-4">Phương thức thanh toán</h2>
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded bg-gray-700 text-white p-4 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                      <span className="text-gray-600">👤</span>
                    </div>
                    <span className="text-center text-sm">Thanh toán khi nhận hàng</span>
                  </div>
                  <div className="border rounded bg-gray-300 p-4 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                      <span className="text-gray-600">📱</span>
                    </div>
                    <span className="text-center text-sm">Chuyển khoản trực tiếp</span>
                  </div>
                </div>
                
                <div className="border rounded p-4 mt-6">
                  <h3 className="font-medium text-red-800 mb-2">Thanh toán khi nhận hàng</h3>
                  <p className="text-gray-700">Quý khách sẽ thanh toán bằng <span className="font-medium">tiền mặt</span> khi đơn vị vận chuyển giao hàng tận nơi.</p>
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
                className={`bg-red-800 text-white py-3 px-6 rounded text-lg font-medium ${!agreeToTerms ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!agreeToTerms}
              >
                Thanh toán 1.544.000 đ (CoD)
              </button>
            </div>
          </div>

          {/* Shipping Info Column */}
          <div className="w-full md:w-80 lg:w-96">
            <div className="bg-white rounded border border-gray-200 p-4">
              <h2 className="text-xl font-medium text-red-800 mb-4">Thông tin nhận hàng</h2>
              
              <div className="mb-4">
                <div className="flex items-center mb-4">
                <input type="radio" id="new-address" name="address" className="mr-2" />
                  <div>
                    <p className="font-medium">Testing</p>
                    <p className="text-gray-600">FPTU</p>
                    <p className="text-gray-600">Phường Cát Lái, Quận 2, Hồ Chí Minh</p>
                    <p className="text-gray-600">0987654321</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input type="radio" id="new-address" name="address" className="mr-2" />
                  <label htmlFor="new-address">Thêm địa chỉ mới</label>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };

  export default CheckoutPage;