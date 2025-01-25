import { useState } from "react";
import { FaLeaf, FaOilCan, FaTint, FaBalanceScale, FaAllergies, FaHeartbeat, FaSun, FaFeather } from "react-icons/fa";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const ProductClassification = () => {
    const [activeTab, setActiveTab] = useState("skinType");

    const tabs = [
        { id: "skinType", label: "Mua theo loại da" },
        { id: "skinProblem", label: "Mua theo vấn đề da" },
        { id: "texture", label: "Mua theo kết cấu" }
    ];

    const skinTypeData = [
        { id: 1, title: "Da dầu", icon: <FaOilCan />, image: assets.da_dau },
        { id: 2, title: "Da khô", icon: <FaLeaf />, image: assets.da_kho },
        { id: 3, title: "Da thường", icon: <FaTint />, image: assets.da_thuong },
        { id: 4, title: "Da tổng hợp", icon: <FaBalanceScale />, image: assets.da_tonghop }
    ];

    const skinProblemData = [
        { id: 1, title: "Da khô, mất nước", icon: <FaAllergies />, image: assets.concern_dry },
        { id: 2, title: "Da không đều màu", icon: <FaHeartbeat />, image: assets.concern_pigmentation },
        { id: 3, title: "Da lão hóa", icon: <FaSun />, image: assets.concern_anti_aging },
        { id: 4, title: "Da lỗ chân lông to", icon: <FaFeather />, image: assets.concern_sensitive },
        { id: 5, title: "Da mụn", icon: <FaFeather />, image: assets.concern_acne },
        { id: 6, title: "Da kém đàn hồi", icon: <FaFeather />, image: assets.concern_oil }
    ];

    const textureData = [
        { id: 1, title: "Dạng kem", icon: <FaTint />, image: assets.type_cream },
        { id: 2, title: "Kết cấu gel", icon: <FaTint />, image: assets.type_gel },
        { id: 3, title: "Kết cấu tạo bọt", icon: <FaTint />, image: assets.type_foam },
        { id: 4, title: "Dung dịch tẩy rửa", icon: <FaTint />, image: assets.type_cleanser },
        { id: 5, title: "Serum cho da mặt", icon: <FaTint />, image: assets.type_serum }
    ];

    const getActiveData = () => {
        switch (activeTab) {
            case "skinType":
                return skinTypeData;
            case "skinProblem":
                return skinProblemData;
            case "texture":
                return textureData;
            default:
                return skinTypeData;
        }
    };

    const getGridClass = () => {
        switch (activeTab) {
            case "skinType":
                return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"; // 4 columns
            case "skinProblem":
                return "grid-cols-1 sm:grid-cols-3 lg:grid-cols-6"; // 6 columns
            case "texture":
                return "grid-cols-1 sm:grid-cols-3 lg:grid-cols-5"; // 5 columns
            default:
                return "grid-cols-4"; // Default to 4 columns
        }
    };

    const ProductCard = ({ item }) => (
        <Link to={""} className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <div className="relative h-200 overflow-hidden">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    style={{
                        aspectRatio: "2 / 2.6"
                    }}
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571";
                    }}
                />
            </div>
            <div className="p-4">
                <div className="flex justify-center items-center space-x-2 mb-2">
                    <span className="text-sm text-primary">{item.icon}</span>
                    <h3 className="text-sm font-heading text-foreground">{item.title}</h3>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="container mx-auto mt-12 mb-8 px-4 py-8 bg-white rounded-lg shadow-lg mt-24">
            <h4 className="text-primary text-sm font-semibold mb-2">TRẢI NGHIỆM MUA HÀNG</h4>
            <h4 className="text-primary mb-8 text-2xl">Phân loại phổ biến tại BeautySkin</h4>

            <div className="mb-8">
                <div className="rounded-lg bg-secondary overflow-hidden">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`rounded-xl mr-4 py-2 px-4 transition-colors duration-300 ${
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

            {/* Dynamic grid based on activeTab */}
            <div className={`grid ${getGridClass()} gap-6 px-24`}>
                {getActiveData().map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default ProductClassification;

