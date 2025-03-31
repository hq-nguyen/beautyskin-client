import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductItem from "../Card/ProductItem";
import Slider from "react-slick";
import { getProductBySkinType } from "../../apis/product";
import { getSkinProfile } from "../../apis/customer";
import { ChevronRight, Sparkles } from "lucide-react";
import { assets } from "../../assets/frontend_assets/assets";

const SkinTypeRecommendations = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    const [userSkinProfile, setUserSkinProfile] = useState(null);

    // Fetch user skin profile if not available in Redux
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await getSkinProfile(user.id);
                setUserSkinProfile(response);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        if (user && user.id) {
            fetchUserProfile();
        }
    }, [user]);


    const skinProfile = userSkinProfile;

    const isUserEligible = user && skinProfile && skinProfile.skinType;

    useEffect(() => {
        const fetchProducts = async () => {
            if (isUserEligible) {
                try {
                    setLoading(true);
                    const skinTypeId = skinProfile.skinType.id;
                    const productData = await getProductBySkinType(skinTypeId);
                    setProducts(Array.isArray(productData) ? productData : []);

                } catch (error) {
                    console.error("Error fetching skin type products:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProducts();
    }, [isUserEligible, skinProfile]);

    if (!isUserEligible || (products.length === 0 && !loading)) {
        return null;
    }

    const sliderSettings = {
        dots: true,
        infinite: products.length > 5,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const getSkinTypeRoute = (skinTypeId) => {
        const skinTypeRoutes = {
          2: 'normal',
          3: 'oily',
          4: 'dry',
          5: 'sensitive',
          6: 'combination'
        };
        
        return skinTypeRoutes[skinTypeId] || 'normal'; 
      };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg shadow-md mt-12 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-100 rounded-full -ml-12 -mb-12 opacity-50"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={20} className="text-rose-500" />
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Đề xuất riêng cho bạn
                        </h2>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">
                        Sản phẩm phù hợp với loại da <span className="font-medium text-rose-600">{skinProfile?.skinType?.name || "Không xác định"}</span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to={skinProfile?.skinType ? `/test-skin/${getSkinTypeRoute(skinProfile.skinType.id)}` : '/test-skin'}
                        className="hidden lg:block group"
                    >
                        <button className="text-sm px-5 py-2.5 bg-rose-600 rounded-full border border-rose-400 text-white hover:bg-rose-600 hover:text-white transition-colors duration-300 shadow-sm flex items-center gap-1 group-hover:gap-2">
                            Khám phá lộ trình chăm sóc da
                        </button>
                    </Link>

                    <Link to="/shop" className="hidden lg:block group">
                        <button className="text-sm px-5 py-2.5 bg-white rounded-full border border-rose-400 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors duration-300 shadow-sm flex items-center gap-1 group-hover:gap-2">
                            Xem tất cả
                            <ChevronRight size={16} className="transition-transform duration-300" />
                        </button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-inner p-2 mb-4">
                    {/* Product Slider */}
                    <Slider {...sliderSettings} className="pb-10">
                        {products.slice(0, 7).map((product, index) => (
                            <div key={index} className="px-2 py-4 transition-transform duration-300 hover:scale-105">
                                <ProductItem
                                    id={product.id}
                                    image={product?.images[0]?.url || assets.product_new_1}
                                    promotion={product.discount || 20}
                                    name={product.name}
                                    oldPrice={product.oldPrice || product.price * 1.2}
                                    newPrice={product.price}
                                    averageRating={product.averageRating}
                                    productSold={product.productSold}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            )}

            <div className="lg:hidden flex justify-center mt-8">
                <Link to="/shop">
                    <button className="text-sm font-medium px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1">
                        Xem tất cả sản phẩm
                        <ChevronRight size={16} />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default SkinTypeRecommendations; 