import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/axios'; // Giả định đã cấu hình Axios

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Giả định dữ liệu mẫu hoặc fetch từ API
  useEffect(() => {
    const fetchNewsArticles = async () => {
      try {
        // Gọi API giả định để lấy tin tức (thay bằng endpoint thực tế)
        const response = await api.get('/news/skin-care-products');
        const newsData = response.data.map(article => ({
          id: article.id,
          title: article.title,
          summary: article.summary,
          image: article.image || 'https://via.placeholder.com/300x200', // Hình ảnh mặc định
          date: article.date || '2025-03-12',
          category: article.category || 'Chăm Sóc Da',
        }));
        setArticles(newsData);
        setFilteredArticles(newsData);
      } catch (error) {
        console.error('Lỗi khi tải bài viết tin tức:', error);
        // Dữ liệu mẫu nếu API thất bại
        const dummyArticles = [
          {
            id: 1,
            title: 'Top 10 Sản Phẩm Chăm Sóc Da Năm 2025',
            summary: 'Khám phá các sản phẩm chăm sóc da mới nhất đang thịnh hành trong năm nay, tập trung vào dưỡng ẩm và chống lão hóa.',
            image: 'https://via.placeholder.com/300x200',
            date: '2025-03-11',
            category: 'Chăm Sóc Da',
          },
          {
            id: 2,
            title: 'Xu Hướng Làm Đẹp Hàn Quốc Mới Đáng Chú Ý',
            summary: 'Khám phá các sản phẩm K-beauty sáng tạo đang xuất hiện trên thị trường, bao gồm serum cho làn da kính.',
            image: 'https://via.placeholder.com/300x200',
            date: '2025-03-10',
            category: 'K-Beauty',
          },
          {
            id: 3,
            title: 'Cách Chọn Kem Dưỡng Ẩm Phù Hợp',
            summary: 'Mẹo từ chuyên gia về cách chọn kem dưỡng ẩm cho da trưởng thành dựa trên các thành phần như ceramides.',
            image: 'https://via.placeholder.com/300x200',
            date: '2025-03-09',
            category: 'Mẹo Chăm Sóc Da',
          },
        ];
        setArticles(dummyArticles);
        setFilteredArticles(dummyArticles);
      }
    };

    fetchNewsArticles();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredArticles(
      articles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="text-center py-10 bg-white rounded-lg shadow-md mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          Tin Tức Sản Phẩm Chăm Sóc Da
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Cập nhật xu hướng mới nhất, đánh giá và mẹo về các sản phẩm chăm sóc da.
        </p>
        <div className="flex justify-center gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm tin tức (ví dụ: kem dưỡng ẩm, K-beauty)..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full max-w-xs p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
          />
          <button className="px-4 py-3 bg-[#EE1F5B] text-white rounded-lg hover:bg-red-600 transition duration-300">
            Tìm kiếm
          </button>
        </div>
      </header>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <Link
              to={`/news/${article.id}`}
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
            >
              <div className="w-full h-48">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {article.summary}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{new Date(article.date).toLocaleDateString('vi-VN')}</span>
                  <span>{article.category}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-lg text-red-500 py-10">
            Không tìm thấy bài viết tin tức nào phù hợp với tìm kiếm của bạn.
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsPage;