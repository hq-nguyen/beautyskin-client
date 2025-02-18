import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, StarIcon, ShareIcon } from 'lucide-react';

// Custom Medal Icon component
const MedalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-yellow-500"
  >
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const RewardPointsManagement = () => {
  return (
    <div className="flex-1 bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mt-[35px]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2 md:mb-0">Quản lý điểm thưởng</h1>
        <div className="flex items-center space-x-2">
          <span className="text-lg">Tổng điểm hiện có: <strong className="text-red-700">0</strong></span>
          <MedalIcon />
          <span className="text-lg">Tương ứng <strong className="text-red-700">0 đ</strong></span>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="mb-8 text-gray-700">
        <p className="mb-2">Điểm tối thiểu để sử dụng: 10 (10000 đ).</p>
        <p>Chưa có lịch sử điểm thưởng.</p>
      </div>
      
      {/* Earn Rewards Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Cách nhận điểm thưởng</h2>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <ShoppingBagIcon className="w-5 h-5 text-green-600 mr-2 mt-1" />
            <span>Mua sắm: +1 điểm cho mỗi 10.000 đ thanh toán</span>
          </li>
          <li className="flex items-start">
            <StarIcon className="w-5 h-5 text-yellow-600 mr-2 mt-1" />
            <span>Đánh giá sản phẩm: +5 điểm cho mỗi đánh giá có ảnh</span>
          </li>
          <li className="flex items-start">
            <ShareIcon className="w-5 h-5 text-blue-600 mr-2 mt-1" />
            <span>Chia sẻ sản phẩm: +2 điểm cho mỗi lượt chia sẻ thành công</span>
          </li>
        </ul>
        <Link 
          to="/mua-hang" 
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
        >
          Mua hàng ngay
        </Link>
      </div>
      
      {/* History Section */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Lịch sử điểm thưởng</h2>
        <p className="text-gray-500 italic">Chưa có lịch sử điểm thưởng.</p>
      </div>
    </div>
  );
};

export default RewardPointsManagement;