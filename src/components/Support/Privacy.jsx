  import React from 'react';

  function PrivacyPolicyPage() {
    return (
      <div className="container mx-auto px-2">
        <div className="flex flex-col md:flex-row gap-8">               
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-[#9b1c2c] mb-6">CHÍNH SÁCH BẢO MẬT</h1>
              
              <p className="mb-6 text-gray-700">
                Beauty Skin cam kết bảo vệ quyền riêng tư của khách hàng khi sử dụng dịch vụ của chúng tôi. 
                Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của Quý khách.
              </p>
              
              <div className="space-y-8">
                {/* Section 1 */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">1. THU THẬP THÔNG TIN CÁ NHÂN</h2>
                  <p className="text-gray-700 mb-3">
                    Chúng tôi có thể thu thập các thông tin sau khi Quý khách sử dụng website:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        <span className="font-semibold">Thông tin cá nhân:</span> Họ tên, số điện thoại, email, địa chỉ giao hàng.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        <span className="font-semibold">Thông tin thanh toán:</span> Số tài khoản ngân hàng, thông tin thẻ (không lưu trữ dữ liệu thẻ của khách hàng).
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        <span className="font-semibold">Thông tin duyệt web:</span> Cookies, địa chỉ IP, lịch sử mua hàng để cải thiện trải nghiệm người dùng.
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* Section 2 */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">2. MỤC ĐÍCH SỬ DỤNG THÔNG TIN</h2>
                  <p className="text-gray-700 mb-3">
                    Chúng tôi sử dụng thông tin cá nhân để:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        Xử lý đơn hàng và giao hàng nhanh chóng.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        Hỗ trợ khách hàng khi có thắc mắc hoặc yêu cầu đổi trả.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        Cải thiện chất lượng dịch vụ, cá nhân hóa trải nghiệm mua sắm.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        Gửi thông báo khuyến mãi, ưu đãi (nếu Quý khách đồng ý).
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* Section 3 */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">3. BẢO MẬT DỮ LIỆU</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        Beauty Skin cam kết không chia sẻ thông tin cá nhân của khách hàng với bên thứ ba, ngoại trừ đối tác vận chuyển và thanh toán.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        Chúng tôi áp dụng các biện pháp bảo mật cao cấp để bảo vệ thông tin khách hàng khỏi truy cập trái phép.
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* Section 4 */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">4. QUYỀN CỦA KHÁCH HÀNG</h2>
                  <p className="text-gray-700 mb-3">
                    Quý khách có quyền:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        Kiểm tra, cập nhật hoặc yêu cầu xóa thông tin cá nhân bất kỳ lúc nào.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                      <div>
                        Từ chối nhận email quảng cáo từ Beauty Skin.
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* Section 5 */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">5. LIÊN HỆ</h2>
                  <p className="text-gray-700 mb-3">
                    Nếu có bất kỳ thắc mắc nào về chính sách bảo mật, vui lòng liên hệ:
                  </p>
                  <div className="flex flex-col space-y-1 text-gray-700">
                    <p>📧 Email: <a href="mailto: beautyskin@gmail.com" className="text-[#9b1c2c]">beautyskin@gmail.com</a></p>
                    <p>📞 Hotline: <a href="tel:0123456789" className="text-[#9b1c2c]">0123 456 789</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default PrivacyPolicyPage;