import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductListCart = ({ cart }) => {
  const isBuyNow = useSelector((state) => state.cart?.isBuyNow || false);
  
  if (!cart || cart.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">
          {isBuyNow ? "Không có sản phẩm để mua ngay" : "Giỏ hàng của bạn trống"}
        </p>
        <Link to="/shop" className="text-rose-600 hover:underline mt-2 inline-block">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="border rounded-md mb-6">
      <div className="bg-gray-50 py-3 px-4 border-b">
        <h3 className="font-medium">
          {isBuyNow ? "Sản phẩm mua ngay" : `Sản phẩm trong giỏ hàng (${cart.length})`}
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {cart.map((product) => (
          <div key={product.id} className="flex flex-col md:flex-row p-4">
            <div className="flex mb-4 md:mb-0">
              <Link to={`/product/${product.id}`} className="mr-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-24 h-24 object-cover rounded-md"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/product/${product.id}`} className="hover:text-rose-600">
                  <h3 className="font-medium">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 mt-1">Số lượng: {product.quantity}</p>
                {product.maxStock && product.maxStock < 10 && (
                  <p className="text-sm text-orange-500 mt-1">
                    Còn {product.maxStock} sản phẩm trong kho
                  </p>
                )}
              </div>
            </div>
            
            <div className="md:ml-auto text-right flex flex-col items-end justify-center">
              {(product.promo > 0 || (product.originalPrice && product.originalPrice > product.price)) && (
                <div className="mb-1">
                  <span className="text-gray-500 line-through text-sm">
                    {product.originalPrice?.toLocaleString() || (product.price * (1 + product.promo/100)).toLocaleString()} đ
                  </span>
                  {product.promo > 0 && (
                    <span className="ml-2 bg-red-600 text-white px-1 py-0.5 text-xs rounded">
                      -{product.promo}%
                    </span>
                  )}
                </div>
              )}
              
              <div className="text-rose-600 font-semibold">
                {product.price.toLocaleString()} đ
              </div>
              
              <div className="text-rose-600 font-semibold mt-1">
                <span className="text-gray-500 font-normal">Tổng:</span> {(product.quantity * product.price).toLocaleString()} đ
              </div>
              
              <span className="text-gray-500 text-xs mt-1">(Giá đã bao gồm VAT)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListCart;