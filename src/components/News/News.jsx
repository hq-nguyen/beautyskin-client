import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const News = () => {

    const lastNews = [
        {
            id: 1,
            tag: "Tin Tức - Deal Hot",
            title: "HappySkin BST Hộp Mặt Nạ, sale cực sốc ! vào Tết này",
            image: assets.news_1,
            date: "16/12/2024",
            nthNews: 9,
        },
        {
            id: 2,
            tag: "Tin Tức - Deal Hot",
            title: "Lương Ý Như Và Emmié by happySkin: Sự Kết Hợp Đầy Hứa Hẹn Trong Hành Trình Chăm Sóc Sắc Đẹp”",
            image: assets.news_2,
            date: "20/12/2024",
            nthNews: 12,
        },
        {
            id: 3,
            tag: "Tin Tức - Deal Hot",
            title: "CEO Emmi Hoàng tham gia Workshop “UPSKILL, UPSCALE - Bứt phá doanh thu mùa mega live cùng TikTokShop”",
            image: assets.news_3,
            date: "08/11/2024",
            nthNews: 10,
        },
        {
            id: 4,
            tag: "Tin Tức - Deal Hot",
            title: "Chính Thức Ra Mắt - Bộ 4 Máy Làm Đẹp Da Đa Năng Emmié by Happyskin Beauty Machine",
            image: assets.news_4,
            date: "16/11/2024",
            nthNews: 11,
        },
    ];

    const NewsCard = ({ item }) => (
        <div className="flex p-4 border-2 border-solid outline-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-md bg-white overflow-hidden">
            {/* Image Section */}
            <div className="sm:w-1/2 w-full h-40 sm:h-36 overflow-hidden rounded-lg">
                <Link>
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src =
                                "https://images.unsplash.com/photo-1556228578-0d85b1a4d571";
                        }}
                    />
                </Link>
            </div>

            {/* Content Section */}
            <div className="sm:w-3/5 w-full px-3 py-2 flex flex-wrap content-between">
                {/* Tag */}
                <div className="w-full mb-1">
                    <Link>
                        <span className="text-secondary hover:text-pink-700 hover:bg-gray-100 text-[10px] font-bold bg-mark px-2 py-1 rounded-md">
                            {item.tag}
                        </span>
                    </Link>
                </div>

                {/* Title */}
                <div className="w-full mb-1">
                    <Link>
                        <h3
                            className="text-md font-semibold hover:text-pink-700 leading-snug line-clamp-3"
                            title={item.title}
                        >
                            {item.title}
                        </h3>
                    </Link>
                </div>

                {/* Date and nthNews */}
                <div className="text-gray-500 text-[12px] w-full flex items-center mt-1">
                    <span>{item.date}</span>
                    <span className="mx-1">●</span>
                    <span>{item.nthNews}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto mb-8 px-4 py-8 bg-white rounded-lg shadow-lg mt-24">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h4 className="text-primary text-xs font-semibold mb-2">
                        CẬP NHẬT THÔNG TIN
                    </h4>
                    <h4 className="text-primary text-lg sm:text-xl font-semibold">
                        Tin tức mới nhất
                    </h4>
                </div>
                <Link to="/news">
                    <button className="text-sm px-4 py-2 bg-gray-600 text-white rounded-full shadow hover:bg-pink-600 transition-colors duration-300">
                        Khám phá thêm
                    </button>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-12">
                {lastNews.map((item) => (
                    <NewsCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default News;
