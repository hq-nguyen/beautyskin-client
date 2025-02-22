import React, { useState } from 'react';

const ShoppingCart = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "L'OREAL",
      description: "Nước Tẩy Trang L'Oreal Làm Sạch Sâu Trang Điểm 400ml",
      price: 174000,
      originalPrice: 289000,
      quantity: 1,
      promo: "Bili 199k L'Oreal Tặng Nước Tẩy Trang L'Oreal Căng Mịn Da 95ml (SL có hạn)",
      image: "https://via.placeholder.com/80x80"
    },
    {
      id: 2,
      name: "CERAVE",
      description: "Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml",
      price: 344000,
      originalPrice: 455000,
      quantity: 1,
      promo: "Bili Cerave 359K Tặng Sữa Rửa Mặt Cerave 30ml (SL có hạn)",
      image: "https://via.placeholder.com/80x80"
    }
  ]);

  const handleQuantityChange = (id, increment) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const newQuantity = Math.max(1, product.quantity + (increment ? 1 : -1));
        return { ...product, quantity: newQuantity };
      }
      return product;
    }));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Navigation */}
      <div className="flex items-center text-gray-500 mb-6">
        <a href="/" className="hover:text-blue-500">Trang chủ</a>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Giỏ hàng</span>
      </div>

      {/* Cart title */}
      <h1 className="text-2xl font-medium mb-6">Giỏ hàng({products.length} sản phẩm)</h1>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products table */}
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
              {products.map((product) => (
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
                            onClick={() => removeProduct(product.id)}
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
                    <div className="font-medium whitespace-nowrap">{product.price.toLocaleString()}&nbsp;đ</div>
                    <div className="text-sm text-gray-500 line-through whitespace-nowrap">{product.originalPrice.toLocaleString()}&nbsp;đ</div>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-center items-center border border-gray-300 rounded w-24 mx-auto">
                      <button
                        className="px-2 py-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleQuantityChange(product.id, false)}
                      >
                        -
                      </button>
                      <span className="px-2">{product.quantity}</span>
                      <button
                        className="px-2 py-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleQuantityChange(product.id, true)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-right font-medium whitespace-nowrap">
                    {(product.price * product.quantity).toLocaleString()}&nbsp;đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bottom summary (mobile) */}
          <div className="lg:hidden mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span>Tạm tính:</span>
              <span className="font-medium whitespace-nowrap">{calculateTotal().toLocaleString()}&nbsp;đ</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Giảm giá:</span>
              <span className="whitespace-nowrap">-0&nbsp;đ</span>
            </div>
            <div className="flex justify-between mb-4 font-medium">
              <span>Tổng cộng:</span>
              <span className="text-orange-500 whitespace-nowrap">{calculateTotal().toLocaleString()}&nbsp;đ</span>
            </div>
            <div className="text-sm text-gray-500 mb-4 text-right">(Đã bao gồm VAT)</div>
          </div>

          {/* Continue Shopping button */}
          <div className="mt-6">
            <button className="flex items-center text-blue-600 hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Tiếp tục mua hàng
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-1/3 hidden lg:block">
          <div className="border border-gray-200 rounded p-6">
            <h2 className="text-xl font-medium mb-4">Hóa đơn của bạn</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-medium whitespace-nowrap">{calculateTotal().toLocaleString()}&nbsp;đ</span>
              </div>
              <div className="flex justify-between">
                <span>Giảm giá:</span>
                <span className="whitespace-nowrap">-0&nbsp;đ</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
                <span>Tổng cộng:</span>
                <span className="text-orange-500 text-xl whitespace-nowrap">{calculateTotal().toLocaleString()}&nbsp;đ</span>
              </div>
              <div className="text-sm text-gray-500 text-right">(Đã bao gồm VAT)</div>
            </div>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded">
              Tiến hành đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;