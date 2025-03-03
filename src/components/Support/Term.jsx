import React from 'react';

function TermsOfUsePage() {
  return (
    <div className="container mx-auto px-2">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-[#9b1c2c] mb-6">ĐIỀU KHOẢN SỬ DỤNG</h1>
            
            <p className="mb-6 text-gray-700">
              Chào mừng Quý khách đến với Beauty Skin! Khi sử dụng trang web của chúng tôi, 
              Quý khách đồng ý tuân theo các điều khoản dưới đây. Vui lòng đọc kỹ trước khi 
              tiếp tục sử dụng dịch vụ của chúng tôi.
            </p>
            
            <div className="space-y-6">
              {/* Section 1 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">1. CHẤP NHẬN ĐIỀU KHOẢN</h2>
                <p className="text-gray-700">
                  Bằng cách truy cập và sử dụng website Beauty Skin, Quý khách đồng ý tuân thủ các 
                  điều khoản và chính sách của chúng tôi. Nếu không đồng ý với bất kỳ điều khoản nào, 
                  Quý khách vui lòng ngừng sử dụng trang web.
                </p>
              </div>
              
              {/* Section 2 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">2. TÀI KHOẢN NGƯỜI DÙNG</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>
                    Để mua sắm tại Beauty Skin, Quý khách có thể cần đăng ký tài khoản với thông tin 
                    chính xác và đầy đủ.
                  </li>
                  <li>
                    Quý khách có trách nhiệm bảo mật thông tin tài khoản và không chia sẻ với bên thứ ba.
                  </li>
                  <li>
                    Beauty Skin có quyền từ chối hoặc hủy bỏ tài khoản của Quý khách nếu phát hiện vi phạm 
                    điều khoản.
                  </li>
                </ul>
              </div>
              
              {/* Section 3 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">3. CHÍNH SÁCH ĐẶT HÀNG VÀ THANH TOÁN</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>
                    Beauty Skin cam kết cung cấp thông tin sản phẩm chính xác nhất có thể.
                  </li>
                  <li>
                    Đơn hàng chỉ được xác nhận sau khi thanh toán thành công hoặc theo chính sách thanh toán 
                    của chúng tôi.
                  </li>
                  <li>
                    Chúng tôi có quyền từ chối hoặc hủy bỏ đơn hàng nếu phát hiện sai sót về giá hoặc 
                    thông tin sản phẩm.
                  </li>
                </ul>
              </div>
              
              {/* Section 4 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">4. CHÍNH SÁCH GIAO HÀNG</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>
                    Chúng tôi giao hàng trên toàn quốc với thời gian và chi phí vận chuyển được thông báo 
                    cụ thể trong quá trình đặt hàng.
                  </li>
                  <li>
                    Beauty Skin không chịu trách nhiệm về sự chậm trễ do yếu tố khách quan như thiên tai, 
                    dịch bệnh, hoặc các vấn đề từ đơn vị vận chuyển.
                  </li>
                </ul>
              </div>
              
              {/* Section 5 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">5. CHÍNH SÁCH ĐỔI TRẢ VÀ HOÀN TIỀN</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>
                    Quý khách có thể đổi trả sản phẩm theo điều kiện được quy định trong Chính Sách Đổi Trả 
                    của Beauty Skin.
                  </li>
                  <li>
                    Sản phẩm đổi trả phải còn nguyên vẹn, chưa qua sử dụng và có đầy đủ hóa đơn mua hàng.
                  </li>
                </ul>
              </div>
              
              {/* Section 6 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">6. QUYỀN SỞ HỮU TRÍ TUỆ</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>
                    Tất cả nội dung trên trang web (bao gồm hình ảnh, văn bản, logo,...) thuộc sở hữu của 
                    Beauty Skin và được bảo vệ bởi luật sở hữu trí tuệ.
                  </li>
                  <li>
                    Nghiêm cấm sao chép, chỉnh sửa hoặc sử dụng trái phép nội dung của Beauty Skin khi chưa 
                    có sự đồng ý của chúng tôi.
                  </li>
                </ul>
              </div>
              
              {/* Section 7 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">7. GIỚI HẠN TRÁCH NHIỆM</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>
                    Beauty Skin không chịu trách nhiệm đối với bất kỳ tổn thất nào do việc sử dụng sản phẩm 
                    không đúng cách hoặc ngoài phạm vi hướng dẫn.
                  </li>
                  <li>
                    Chúng tôi có quyền thay đổi nội dung trang web và chính sách mà không cần thông báo trước.
                  </li>
                </ul>
              </div>
              
              {/* Section 8 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">8. LIÊN HỆ</h2>
                <p className="text-gray-700">
                  Nếu có bất kỳ thắc mắc nào về điều khoản sử dụng, Quý khách vui lòng liên hệ với chúng tôi qua:
                </p>
                <div className="flex flex-col mt-2 space-y-1 text-gray-700">
                  <p>📧 Email: <a href="mailto:beautyskin@gmail.com" className="text-[#9b1c2c]">beautyskin@gmail.com</a></p>
                  <p>📞 Hotline: <a href="tel:0123456789" className="text-[#9b1c2c]">0123 456 789</a></p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-700 font-medium">
                Cảm ơn Quý khách đã tin tưởng và sử dụng dịch vụ của Beauty Skin!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfUsePage;