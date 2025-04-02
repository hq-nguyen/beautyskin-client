import { Link } from "react-router-dom";

const ProductList = ({ cart }) => (
    <>
        {cart.map((product) => (
            <div key={product.id} className="flex flex-col md:flex-row border-b border-gray-200 py-4">
                <div className="flex mb-4 md:mb-0">
                    <Link to={`/product/${product.id}`}>
                        <img src={product.image} alt={product.name} className="w-24 h-20 object-cover mr-2" />
                    </Link>
                    <Link to={`/product/${product.id}`} className="flex-1">
                        <h3 className="font-medium text-sm w-80 hover:text-rose-600">{product.name}</h3>
                    </Link>
                </div>
                <div className="md:ml-auto text-right mt-4 md:mt-0">
                    <div className="flex flex-col items-end">
                        <span className="text-red-600 text-sm font-normal">{product.quantity || 1} x {product.price.toLocaleString()} đ</span>
                        <span className="text-red-600 font-semibold">
                            <span className='text-gray-500 font-normal'>Tổng:</span> {(product.quantity * product.price).toLocaleString()} đ
                        </span>
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
    </>
);

export default ProductList;