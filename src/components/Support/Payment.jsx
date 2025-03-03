import React from 'react';

function PaymentPage() {
    return (
        <div className="container mx-auto px-2">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-[#9b1c2c] mb-6">CHÍNH SÁCH THANH TOÁN</h1>

                        <div className="space-y-8">
                            {/* Section 1 */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">1. PHƯƠNG THỨC THANH TOÁN</h2>
                                <p className="text-gray-700 mb-3">
                                    Beauty Skin hỗ trợ các hình thức thanh toán sau:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                                        <div>
                                            <span className="font-semibold">Thanh toán khi nhận hàng (COD):</span> Khách hàng thanh toán trực tiếp khi nhận sản phẩm từ đơn vị giao hàng.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                                        <div>
                                            <span className="font-semibold">Chuyển khoản ngân hàng:</span> Khách hàng chuyển khoản vào tài khoản ngân hàng của Beauty Skin theo thông tin cung cấp trên đơn hàng.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                                        <div>
                                            <span className="font-semibold">Thanh toán qua ví điện tử</span> Hỗ trợ thanh toán qua VNPay.
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">2. CHÍNH SÁCH THANH TOÁN AN TOÀN</h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                                        <div>
                                            Beauty Skin sử dụng các cổng thanh toán bảo mật cao, đảm bảo thông tin thẻ của khách hàng được mã hóa an toàn.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                                        <div>
                                            Không lưu trữ thông tin thẻ tín dụng của khách hàng trên hệ thống.
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Section 3 */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">3. CHÍNH SÁCH HOÀN TIỀN</h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                                        <div>
                                            Nếu đơn hàng bị hủy do lỗi từ Beauty Skin, chúng tôi sẽ hoàn tiền 100% trong vòng 5-7 ngày làm việc.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                                        <div>
                                            Đối với trường hợp khách hàng hủy đơn hàng, quy trình hoàn tiền sẽ tuân theo chính sách hoàn trả của chúng tôi.
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Section 4 */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">4. LƯU Ý</h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                                        <div>
                                            Khách hàng cần cung cấp thông tin chính xác khi thực hiện thanh toán để tránh lỗi phát sinh.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="bg-[#303947] h-2 w-2 rounded-full mt-2 mr-2"></div>
                                        <div>
                                            Beauty Skin không chịu trách nhiệm nếu khách hàng nhập sai thông tin thanh toán.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;