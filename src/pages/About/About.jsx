import React, { useState } from 'react';
import { assets } from '../../assets/frontend_assets/assets';

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-16 bg-gray-100 mt-12">
      {/* Who Are We Section */}
      <section className="relative flex flex-col md:flex-row">

        <div className="md:w-2/5 flex justify-left pl-4 mb-8">
          <img src={assets.about_us_3} alt="Models using products" className="w-4/5 h-96 object-cover shadow-lg" />
        </div>

        <div className="lg:w-2/5 md:w-3/5 flex flex-col md:text-left space-y-4 pl-4 bg-gray-100">
          <div className="text-3xl font-semibold text-primary leading-none">
            Về Beauty Skin
          </div>
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

          <div className="absolute hidden lg:block right-4 object-cover z-0">
            <img src={assets.about_us_2} alt="Models using products" className="w-64  object-cover" />
          </div>
        </div>

      </section>
      <hr className="w-4/5 mx-auto border-gray-300" />


      {/* Vision section */}
      <section className='flex flex-col md:flex-row'>
        <div className='md:w-1/2 w-full flex justify-left h-fit pl-4'>
          <img src={assets.about_us_1} alt="" className='mb-8 w-4/5 h-4/5 object-cover ' />
        </div>
        <div className='md:w-1/2 w-full pl-4'>
          <h1 className='text-2xl md:text-3xl font-semibold text-primary leading-none'>SỨ MỆNH VÀ TẦM NHÌN</h1>
          <div className="text-lg text-gray-600 text-justify z-10 bg-gray-100 pr-4 pt-4">
            <p>
              <span className="font-semibold">BeautySkin</span> ra đời với mong muốn mang lại niềm vui và tự tin cho mọi người thông qua việc cung cấp các sản phẩm làm đẹp và dịch vụ chăm sóc da chất lượng cao. Thương hiệu đã tạo ra những trải nghiệm mua sắm trực tuyến tuyệt vời cùng dịch vụ Spa chuyên nghiệp với các thiết bị hiện đại hàng đầu thế giới hiện nay.
            </p>

            <p>
              <span className="font-semibold">Với chất lượng tốt</span> và <span className="font-semibold">sự ủng hộ từ cộng đồng</span>, BeautySkin đã tạo dựng được niềm tin với hơn 500.000 khách hàng trong và ngoài nước. Chúng tôi không chỉ tập trung vào việc mang đến một làn da khỏe đẹp từ các sản phẩm làm đẹp chất lượng cao, mà còn đảm bảo rằng khách hàng có một trải nghiệm thư giãn và chăm sóc chuyên nghiệp tại các Spa trong hệ thống.
            </p>
          </div>
          <img src={assets.vision_award} alt="" className='mt-8 pr-4' />
        </div>
      </section>
      <hr className="w-4/5 mx-auto border-gray-300" />


      {/* Why Choose Us Section */}
      <section className='flex flex-col'>
        <h1 className='text-3xl font-semibold text-center text-primary mb-4'>
          Tại sao bạn nên chọn chúng tôi?
        </h1>
        <div className="lg:px-20 md:px-8">
          <p className="text-lg text-gray-600 text-justify z-10 bg-gray-100 pr-4">
            <span className="font-bold">Beauty Skin</span> là người bạn đồng hành đáng tin cậy trên hành trình chăm sóc làn da khỏe mạnh và rạng rỡ. Với cam kết không ngừng nghỉ về chất lượng và kết quả, chúng tôi mang đến cho bạn trải nghiệm chăm sóc da khác biệt.
            <br />
            Mỗi sản phẩm của chúng tôi đều được lựa chọn kỹ lưỡng để mang lại hiệu quả mong muốn, và đội ngũ chuyên gia của chúng tôi luôn sẵn sàng cung cấp hướng dẫn cá nhân hóa phù hợp với nhu cầu riêng biệt của bạn.
            <br />
            Chúng tôi đặt sự minh bạch, an toàn và sự hài lòng của bạn lên hàng đầu. Hãy cùng chúng tôi khám phá sức mạnh biến đổi của chăm sóc da hiệu quả, và để <span className="font-bold text-pink-500">Beauty Skin</span> giúp bạn tìm thấy phiên bản tốt nhất của chính mình.
          </p>
        </div>
        <div className="flex md:flex-row flex-col justify-center items-center mt-12 gap-6">
          <div className="w-full sm:w-1/3 flex justify-center">
            <img
              src={assets.why_choose_us1}
              className="w-2/3 border-t-8 border-l-8 border-t-pink-500 border-l-pink-500 rounded-tl-full rounded-tr-full"
              alt="Why Choose Us 1"
            />
          </div>
          <div className="w-full sm:w-1/3 flex justify-center">
            <img
              src={assets.why_choose_us2}
              className="w-2/3 border-t-8 border-l-8 border-t-pink-500 border-l-pink-500 rounded-tl-full rounded-tr-full"
              alt="Why Choose Us 2"
            />
          </div>
          <div className="w-full sm:w-1/3 flex justify-center">
            <img
              src={assets.why_choose_us3}
              className="w-2/3 border-t-8 border-l-8 border-t-pink-500 border-l-pink-500 rounded-tl-full rounded-tr-full"
              alt="Why Choose Us 3"
            />
          </div>
        </div>
      </section>
      <hr className="w-4/5 mx-auto border-gray-300" />


      {/* What we offer Section */}
      {/* What we offer Section */}
<section className='flex flex-col'>
  <h1 className='text-3xl font-semibold text-center text-primary mb-4'>
    Dịch vụ của chúng tôi
  </h1>
  <div className="flex md:flex-row flex-col justify-center items-center mt-12 gap-6">
    <div className="w-full sm:w-1/3 flex flex-col justify-center items-center">
      <img
        src={assets.authentic_icon}
        className="w-2/3"
        alt="Authentic Service"
      />
      <div className="w-2/3 bg-pink-500 text-white text-center py-2 mt-2 rounded-b-lg">
        <p className="font-bold">Chất Lượng Chính Hãng</p>
      </div>
    </div>
    <div className="w-full sm:w-1/3 flex flex-col justify-center items-center">
      <img
        src={assets.support_icon}
        className="w-2/3"
        alt="Support Service"
      />
      <div className="w-2/3 bg-pink-500 text-white text-center py-2 mt-2 rounded-b-lg">
        <p className="font-bold">Hỗ Trợ 24/7</p>
      </div>
    </div>
    <div className="w-full sm:w-1/3 flex flex-col justify-center items-center">
      <img
        src={assets.ship_icon}
        className="w-2/3"
        alt="Shipping Service"
      />
      <div className="w-2/3 bg-pink-500 text-white text-center py-2 mt-2 rounded-b-lg">
        <p className="font-bold">Giao Hàng Nhanh</p>
      </div>
    </div>
    <div className="w-full sm:w-1/3 flex flex-col justify-center items-center">
      <img
        src={assets.certified_icon}
        className="w-2/3"
        alt="Certified Service"
      />
      <div className="w-2/3 bg-pink-500 text-white text-center py-2 mt-2 rounded-b-lg">
        <p className="font-bold">Sản Phẩm Chứng Nhận</p>
      </div>
    </div>
  </div>
</section>

      <hr className="w-4/5 mx-auto border-gray-300" />

      {/* Video Section */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold text-center text-primary mb-8">Xem thêm về chúng tôi</h2>
        <div className="flex justify-center relative">
          <img src={assets.thumbnail} alt="Video Thumbnail" className="w-4/5 object-cover rounded-md shadow-lg" />
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-6 py-4 rounded-md hover:bg-pink-500 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Watch Video
          </button>
        </div>
      </section>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 100 }}>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96" >
            <p className="text-lg mb-4">Video is not available now.</p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-80 transition"
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

