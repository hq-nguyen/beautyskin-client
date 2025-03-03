import React from 'react';

function RefundPage() {
  return (
    <div className="container mx-auto px-2">
      <div className="flex flex-col md:flex-row gap-8">               
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-[#9b1c2c] mb-6">CHÍNH SÁCH HOÀN TRẢ ĐƠN HÀNG</h1>
            
            <p className="mb-6 text-gray-700">
            Beauty Skin cam kết mang đến cho khách hàng những sản phẩm chất lượng và trải nghiệm mua sắm tốt nhất.
            Nếu có bất kỳ vấn đề nào với đơn hàng, Quý khách có thể yêu cầu đổi trả theo các điều kiện dưới đây.
            </p>
            
            <div className="space-y-8">
              {/* Section 1 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">1. ĐIỀU KIỆN HOÀN TRẢ</h2>
                <p className="text-gray-700 mb-3">
                    Quý khách có thể yêu cầu hoàn trả sản phẩm nếu đáp ứng tất cả các điều kiện sau:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Sản phẩm còn nguyên vẹn, chưa qua sử dụng và đầy đủ phụ kiện, tem, nhãn mác.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Sản phẩm bị lỗi do nhà sản xuất hoặc hư hỏng trong quá trình vận chuyển.
                    </div>
                  </li>
                  <li className="flex items-start">
                  <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Sản phẩm nhận được không đúng với đơn đặt hàng.
                    </div>
                  </li>
                  <li className="flex items-start">
                  <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Yêu cầu hoàn trả được gửi trong vòng 7 ngày kể từ ngày nhận hàng.
                    </div>
                  </li>
                  <h4 className='font-semibold'>
                    Lưu ý:
                    </h4>
                    <li className="flex items-start">
                    <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Không áp dụng đổi trả với các sản phẩm đã sử dụng hoặc do khách hàng làm hư hỏng.
                    </div>
                  </li>
                  <li className="flex items-start">
                  <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Không áp dụng đổi trả với các sản phẩm đã sử dụng hoặc do khách hàng làm hư hỏng.
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Section 2 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">2. QUY TRÌNH HOÀN TRẢ</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div>
                    Bước 1: Liên hệ Beauty Skin qua Hotline 0123 456 789 hoặc Email <a href="mailto: beautyskin@gmail.com">beautyskin@gmail.com</a> để gửi yêu cầu hoàn trả.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div>
                    Bước 2: Cung cấp thông tin đơn hàng và hình ảnh sản phẩm lỗi để xác minh.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div>
                    Bước 3: Sau khi được xác nhận, Quý khách gửi sản phẩm về địa chỉ của Beauty Skin.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div>
                    Bước 4: Beauty Skin kiểm tra sản phẩm và tiến hành hoàn tiền hoặc đổi hàng trong 5-7 ngày làm việc.
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Section 3 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">3. CHI PHÍ HOÀN TRẢ</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Nếu lỗi thuộc về Beauty Skin (giao sai sản phẩm, lỗi từ nhà sản xuất), chúng tôi sẽ chịu 100% phí vận chuyển khi hoàn trả.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Nếu khách hàng muốn đổi trả vì lý do cá nhân (không thích, chọn nhầm), khách hàng sẽ tự chịu phí vận chuyển.
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Section 4 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">4. PHƯƠNG THỨC HOÀN TIỀN</h2>
                <p className="text-gray-700 mb-3">
                Sau khi xác nhận hoàn trả hợp lệ, Beauty Skin sẽ hoàn tiền theo các phương thức sau:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Chuyển khoản ngân hàng (thời gian 5-7 ngày làm việc).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Hoàn tiền vào ví điện tử nếu khách hàng thanh toán qua VNPay.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                    <div>
                    Không áp dụng hoàn tiền mặt cho đơn hàng trực tuyến.
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Section 5 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">5. LIÊN HỆ</h2>
                <p className="text-gray-700 mb-3">
                  Nếu có bất kỳ thắc mắc nào về chính sách hoàn trả, vui lòng liên hệ:
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

export default RefundPage;