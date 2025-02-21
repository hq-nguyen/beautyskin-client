import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaEye, FaHeart } from 'react-icons/fa';
import StarRating from '../utils/StarRating';

const ProductItem = ({ id, image, promotion, name, rating, oldPrice, newPrice }) => {

    return (
        <Link key={id} 
            className="relative flex flex-col bg-white p-4 pb-8 hover:border hover:border-rose-500 transition-transform duration-150"
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
                    <span className="text-xs text-gray-500 line-through flex items-center"><span className='text-[10px]'>đ</span>{oldPrice}</span>
                    <span className="ml-2 text-base font-semibold text-primary flex items-center"><span className='text-[12px]'>đ</span>{newPrice}</span>
                </div>

                <div className="flex space-x-2 mt-2">
                    <button
                        className="flex-1 bg-primary text-white py-2 rounded-md transition-colors duration-300 hover:opacity-80 flex items-center justify-center space-x-1"
                    >
                        <FaEye className="w-4 h-4" />
                        <span>Xem nhanh</span>
                    </button>
                    <button
                        className="bg-gray-100 p-2 rounded-md transition-colors duration-300 hover:opacity-90"
                    >
                        <FaHeart className="w-4 h-4 hover:text-red-500" />
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

export default ProductItem