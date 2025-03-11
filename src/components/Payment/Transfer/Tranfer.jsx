import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle2, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Transfer = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // Giả lập dữ liệu đơn hàng
  const mockOrderData = {
    orderId: 'DH123456',
    total: 1544000,
    bankInfo: {
      bankName: 'Ngân hàng TMCP Công Thương Việt Nam (VietinBank)',
      accountNumber: '1234567890',
      accountName: 'Công ty TNHH HappySkin',
      branch: 'Chi nhánh Hà Nội'
    }
  };

//   useEffect(() => {
//     const fetchPaymentData = async () => {
//       setIsLoading(true);
//       try {
//         // Giả lập API call để lấy mã QR từ VNPay
//         const response = await api.post('/vnpay/create_payment', {
//           orderId: mockOrderData.orderId,
//           amount: mockOrderData.total,
//           orderDesc: 'Thanh toán đơn hàng HappySkin'
//         });
        
//         setQrCodeUrl(response.data.qrCodeUrl); // URL mã QR từ VNPay
//         setOrderData(mockOrderData);
//       } catch (error) {
//         toast.error('Không thể tạo mã thanh toán. Vui lòng thử lại!');
//         console.error(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPaymentData();

//     // Kiểm tra trạng thái thanh toán mỗi 10 giây
//     const interval = setInterval(checkPaymentStatus, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const checkPaymentStatus = async () => {
//     try {
//       const response = await api.get(`/vnpay/check_status/${mockOrderData.orderId}`);
//       if (response.data.status === 'success') {
//         setPaymentStatus('success');
//         toast.success('Thanh toán thành công!');
//       }
//     } catch (error) {
//       console.error('Lỗi kiểm tra trạng thái:', error);
//     }
//   };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans mt-8">
      {/* Header */}
      <h1 className="text-2xl font-medium text-[#d90429] mb-6 text-center">
        Thanh toán qua VNPay
      </h1>

      {isLoading ? (
        <div className="text-center text-gray-600">Đang tạo mã thanh toán...</div>
      ) : paymentStatus === 'success' ? (
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-xl font-medium text-[#d90429] mb-2">
            Thanh toán thành công!
          </p>
          <p className="text-gray-600">
            Mã đơn hàng: <span className="font-bold">{orderData?.orderId}</span>
          </p>
          <button
            onClick={handleContinueShopping}
            className="mt-6 bg-[#EE1F5B] text-white py-3 px-6 rounded text-sm font-medium hover:bg-[#d90429]"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* QR Code Section */}
          <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-xl font-medium text-[#d90429] mb-4 flex items-center">
              <QrCode className="w-6 h-6 mr-2" />
              Quét mã QR để thanh toán
            </h2>
            <div className="flex justify-center">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="VNPay QR Code" 
                  className="w-64 h-64"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                  Đang tải mã QR...
                </div>
              )}
            </div>
            <p className="text-gray-600 text-center mt-4">
              Sử dụng ứng dụng Mobile Banking hoặc ví điện tử để quét mã QR
            </p>
            <p className="text-gray-500 text-sm text-center mt-2">
              Mã QR có hiệu lực trong 15 phút
            </p>
          </div>

          {/* Bank Account Info */}
          <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-xl font-medium text-[#d90429] mb-4 flex items-center">
              <Banknote className="w-6 h-6 mr-2" />
              Thông tin chuyển khoản ngân hàng
            </h2>
            <div className="space-y-2 text-gray-800">
              <p>
                <span className="font-medium">Ngân hàng:</span> TP Bank{orderData?.bankInfo.bankName}
              </p>
              <p>
                <span className="font-medium">Số tài khoản:</span> 24265498888 {orderData?.bankInfo.accountNumber}
              </p>
              <p>
                <span className="font-medium">Chủ tài khoản:</span> Trương Quốc Hưng {orderData?.bankInfo.accountName}
              </p>
              <p>
                <span className="font-medium">Chi nhánh:</span> Thủ Đức {orderData?.bankInfo.branch}
              </p>
              <p>
                <span className="font-medium">Số tiền:</span> {orderData?.total.toLocaleString()} đ
              </p>
              <p>
                <span className="font-medium">Nội dung:</span> Thanh toán đơn hàng {orderData?.orderId}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-red-50 border border-red-200 rounded p-6">
            <h3 className="text-lg font-medium text-[#d90429] mb-2">
              Hướng dẫn thanh toán
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử hỗ trợ VNPay</li>
              <li>Hoặc chuyển khoản trực tiếp qua thông tin tài khoản trên</li>
              <li>Kiểm tra kỹ số tiền và nội dung chuyển khoản</li>
              <li>Hệ thống sẽ tự động xác nhận trong vòng 5-10 phút sau khi thanh toán</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <button
              onClick={handleContinueShopping}
              className="bg-[#EE1F5B] text-white py-3 px-6 rounded text-sm font-medium hover:bg-gray-300"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;