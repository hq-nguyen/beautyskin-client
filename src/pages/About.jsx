import React, { useState } from 'react';
import { assets } from '../assets/frontend_assets/assets';

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-16 bg-gray-100 mt-12">
      {/* Who Are We Section */}
      <section className="relative flex flex-col md:flex-row">

        {/* First Image Group (Left Side) */}
        <div className="md:w-2/5 flex justify-left pl-4 mb-8">
          <img src={assets.about_us_3} alt="Models using products" className="w-4/5 h-96 object-cover shadow-lg" />
        </div>

        {/* Title and Text Group (Right Side) */}
        <div className="lg:w-2/5 md:w-3/5 flex flex-col md:text-left space-y-4 pl-4 bg-gray-100">
          {/* Title */}
          <div className="text-3xl font-bold text-primary leading-none">
            Về Beauty Skin
          </div>
          {/* Description with background */}
          <div className="text-lg text-gray-600 text-justify z-10 bg-gray-100 pr-4 pt-4">
            <p>
              <span className="font-semibold">BeautySkin</span> là điểm đến lý tưởng dành cho những tín đồ yêu thích làm đẹp, nơi hội tụ những thương hiệu chăm sóc da uy tín với thành phần an toàn và hiệu quả. Chúng tôi cam kết mang đến các sản phẩm chất lượng cao, được chọn lọc kỹ lưỡng để đáp ứng mọi nhu cầu làn da, giúp bạn tự tin trên hành trình chinh phục vẻ đẹp riêng của mình.
            </p>

            <p>
              Với sứ mệnh <span className="font-semibold">"Làm đẹp an toàn - Làn da khỏe mạnh"</span>, BeautySkin không chỉ cung cấp sản phẩm mà còn là người bạn đồng hành, mang đến những giải pháp làm đẹp toàn diện. Tại đây, bạn có thể khám phá các sản phẩm chăm sóc da chuyên sâu, công nghệ làm đẹp tiên tiến và những bí quyết skincare được chia sẻ từ các chuyên gia.
            </p>

            <p>
              BeautySkin tin rằng <span className="italic">một làn da đẹp là nền tảng của sự tự tin và hạnh phúc</span>. Chúng tôi không ngừng nâng cao chất lượng dịch vụ, mang đến trải nghiệm mua sắm hiện đại, tiện lợi và đáng tin cậy. Hãy cùng BeautySkin nâng tầm chu trình chăm sóc da của bạn ngay hôm nay!
            </p>
          </div>

          {/* Second Image Behind the Text (Top-right corner, small) */}
          <div className="absolute hidden lg:block right-4 object-cover z-0">
            <img src={assets.about_us_2} alt="Models using products" className="w-64  object-cover" />
          </div>
        </div>

      </section>
      <hr className="w-4/5 mx-auto border-gray-300" />


      {/* Meet the Founder Section */}

      {/* Why Choose Us Section */}

      {/* Video Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Watch Our Story</h2>
        <div className="flex justify-center relative">
          <img src={assets.thumbnail} alt="Video Thumbnail" className="w-3/5 h-80 object-cover rounded-md shadow-lg" />
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-md hover:bg-pink-500 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Watch Video
          </button>
        </div>
      </section>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <p className="text-lg mb-4">Video is not available now.</p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;

