import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import StarRating from '../utils/StarRating';
import { formatCurrency } from '../../utils/format';

const ProductItem = ({ id, image, promotion, name, rating, oldPrice, newPrice }) => {

    return (
        <Link key={id} 
            className="relative flex flex-col bg-white p-2 pb-8 hover:border hover:border-rose-500 transition-transform duration-150"
            to={`/product/${id}`}
        >
            <div className="relative h-60 group hover:scale-95 transition-transform duration-300">
                <div className="absolute top-2 left-2 bg-primary font-semibold text-white text-xs px-2 py-1 rounded">
                    - {promotion}%
                </div>
                <img src={image} alt={name} className="w-full object-cover h-48 mt-12" />
            </div>
            <div className="mt-4">
                <h3 className="text-sm text-gray-800 hover:text-rose-600 truncate">{name}</h3>
                <div className="flex items-center my-1">
                    <StarRating rating={rating} />
                    <span className="text-xs text-gray-500">(10)</span>
                </div>
                <div className="flex items-center">
                    <span className="text-xs text-gray-500 line-through flex items-center">{formatCurrency(oldPrice)}</span>
                    <span className="ml-2 text-base font-semibold text-primary flex items-center">{formatCurrency(newPrice)}</span>
                </div>

                {/* Full-width Add to Cart button */}
                <div className="mt-2">
                    <button
                        className="w-full bg-primary text-white py-2 rounded-md transition-colors duration-300 hover:opacity-80 flex items-center justify-center"
                    >
                        <FaShoppingCart className="w-4 h-4 mr-2" />
                        <span>Thêm vào giỏ</span>
                    </button>
                </div>
            </div>
        </Link>
    )
}

ProductItem.propTypes = {
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    promotion: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number,
    oldPrice: PropTypes.number.isRequired,
    newPrice: PropTypes.number
};

export default ProductItem;