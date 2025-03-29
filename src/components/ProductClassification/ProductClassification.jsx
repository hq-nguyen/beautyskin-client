import { useState } from "react";
import { FaLeaf, FaOilCan, FaTint, FaBalanceScale, FaAllergies, FaHeartbeat, FaSun, FaFeather } from "react-icons/fa";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const ProductClassification = () => {
    const [activeTab, setActiveTab] = useState("skinType");

    const tabs = [
        { id: "skinType", label: "Mua theo loại da" },
        { id: "skinConcern", label: "Mua theo vấn đề da" },
        { id: "texture", label: "Mua theo kết cấu" }
    ];

    const skinTypeData = [
        { id: 1, title: "Da dầu", icon: <FaOilCan />, image: assets.da_dau, filter: "da dầu" },
        { id: 2, title: "Da khô", icon: <FaLeaf />, image: assets.da_kho, filter: "da khô" },
        { id: 3, title: "Da thường", icon: <FaTint />, image: assets.da_thuong, filter: "da thường" },
        { id: 4, title: "Da tổng hợp", icon: <FaBalanceScale />, image: assets.da_tonghop, filter: "da hỗn hợp" }
    ];

    const skinConcern = [
        { id: 1, title: "Da khô, mất nước", icon: <FaAllergies />, image: assets.concern_dry, filter: "dehydrated" },
        { id: 2, title: "Da không đều màu", icon: <FaHeartbeat />, image: assets.concern_pigmentation, filter: "uneven" },
        { id: 3, title: "Da lão hóa", icon: <FaSun />, image: assets.concern_anti_aging, filter: "aging" },
        { id: 4, title: "Da lỗ chân lông to", icon: <FaFeather />, image: assets.concern_sensitive, filter: "pores" },
        { id: 5, title: "Da mụn", icon: <FaFeather />, image: assets.concern_acne, filter: "acne" },
        { id: 6, title: "Da kém đàn hồi", icon: <FaFeather />, image: assets.concern_oil, filter: "elasticity" }
    ];

    const textureData = [
        { id: 1, title: "Dạng kem", icon: <FaTint />, image: assets.type_cream, filter: "cream" },
        { id: 2, title: "Kết cấu gel", icon: <FaTint />, image: assets.type_gel, filter: "gel" },
        { id: 3, title: "Kết cấu tạo bọt", icon: <FaTint />, image: assets.type_foam, filter: "foam" },
        { id: 4, title: "Dung dịch tẩy rửa", icon: <FaTint />, image: assets.type_cleanser, filter: "cleanser" },
        { id: 5, title: "Serum cho da mặt", icon: <FaTint />, image: assets.type_serum, filter: "serum" }
    ];

    const getActiveData = () => {
        switch (activeTab) {
            case "skinType":
                return skinTypeData;
            case "skinConcern":
                return skinConcern;
            case "texture":
                return textureData;
            default:
                return skinTypeData;
        }
    };

    const getGridClass = () => {
        switch (activeTab) {
            case "skinType":
                return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4";
            case "skinConcern":
                return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
            case "texture":
                return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
            default:
                return "grid-cols-4";
        }
    };

    // Generate the correct URL parameter based on the selected tab
    const getLinkUrl = (item) => {
        switch (activeTab) {
            case "skinType":
                return `/shop?skinType=${encodeURIComponent(item.filter)}`;
            case "skinConcern":
                return `/shop?skinConcern=${encodeURIComponent(item.filter)}`;
            case "texture":
                return `/shop?texture=${encodeURIComponent(item.filter)}`;
            default:
                return `/shop?skinType=${encodeURIComponent(item.filter)}`;
        }
    };

    const ProductCard = ({ item }) => (
        <Link
            to={getLinkUrl(item)}
            className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
            <div className="relative h-200 overflow-hidden">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    style={{ aspectRatio: "2 / 2.6" }}
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571";
                    }}
                />
            </div>
            <div className="p-4">
                <div className="flex justify-center items-center space-x-2 mb-2">
                    <span className="text-sm text-primary">{item.icon}</span>
                    <p className="text-sm font-heading text-foreground">{item.title}</p>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="container mx-auto mt-12 mb-8 px-4 sm:px-12 lg:px-24 py-8 bg-white rounded-lg shadow-lg mt-24">
            <h4 className="text-primary text-sm font-semibold mb-2">TRẢI NGHIỆM MUA HÀNG</h4>
            <h4 className="text-primary mb-8 text-2xl">Phân loại phổ biến tại BeautySkin</h4>

            <div className="mb-8">
                <div className="rounded-lg bg-secondary overflow-hidden">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`rounded-xl mr-4 mb-4 py-2 px-4 transition-colors duration-300 ${
                                activeTab === tab.id
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-foreground hover:bg-muted"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`grid ${getGridClass()} gap-6 px-4 sm:px-12 lg:px-24`}>
                {getActiveData().map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default ProductClassification;