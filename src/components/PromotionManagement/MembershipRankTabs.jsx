import { useState } from 'react';
import { StarIcon, CrownIcon } from 'lucide-react';

const MembershipRankTabs = () => {
  const [activeTab, setActiveTab] = useState('bronze');

  const tabs = [
    { id: 'bronze', label: 'Bronze', color: 'text-amber-700', bgColor: 'bg-amber-100' },
    { id: 'silver', label: 'Silver', color: 'text-gray-500', bgColor: 'bg-gray-100' },
    { id: 'gold', label: 'Gold', color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { id: 'diamond', label: 'Diamond', color: 'text-blue-500', bgColor: 'bg-blue-50' }
  ];

  const rankBenefits = {
    bronze: [
      { title: 'Điều kiện', content: 'Tổng chi tiêu từ 0 đến dưới 5.000.000đ' },
    ],
    silver: [
      { title: 'Điều kiện', content: 'Tổng chi tiêu từ 5.000.000đ đến dưới 10.000.000đ' },
      { title: 'Ưu đãi hấp dẫn', content: 'Các mã khuyến mãi dành riêng cho khách hàng ở cấp bậc Silver' },
    ],
    gold: [
      { title: 'Điều kiện', content: 'Tổng chi tiêu từ 10.000.000đ đến dưới 20.000.000đ' },
      { title: 'Ưu đãi hấp dẫn', content: 'Các mã khuyến mãi dành riêng cho khách hàng ở cấp bậc Gold' },
    ],
    diamond: [
      { title: 'Điều kiện', content: 'Tổng chi tiêu từ 20.000.000đ trở lên' },
      { title: 'Ưu đãi hấp dẫn', content: 'Các mã khuyến mãi dành riêng cho khách hàng ở cấp bậc Diamond' },
    ]
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 'bronze':
        return <StarIcon className="w-5 h-5 text-amber-700" />;
      case 'silver':
        return <StarIcon className="w-5 h-5 text-gray-500" />;
      case 'gold':
        return <StarIcon className="w-5 h-5 text-yellow-500" />;
      case 'diamond':
        return <CrownIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <StarIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm mb-6">
      <div className="p-4 bg-rose-600 text-white rounded-t-lg">
        <h2 className="text-xl font-bold text-center flex items-center justify-center">
          <StarIcon className="w-6 h-6 mr-2 text-yellow-300" />
          CẬP NHẬT ƯU ĐÃI HẠNG THÀNH VIÊN BEAUTYSKIN
          <StarIcon className="w-6 h-6 ml-2 text-yellow-300" />
        </h2>
        <p className="text-center mt-2">Vui lòng chọn hạng thành viên để xem chi tiết ưu đãi</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === tab.id 
                ? `${tab.color} border-b-2 border-rose-600 ${tab.bgColor}` 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="flex items-center justify-center">
              {getRankIcon(tab.id)}
              <span className="ml-1">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {tabs.map((tab) => (
          <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
            <div className="flex justify-center mb-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${tab.bgColor} ${tab.color}`}>
                {getRankIcon(tab.id)}
                <span className="ml-1 font-bold">{tab.label}</span>
              </div>
            </div>

            <div className="space-y-4">
              {rankBenefits[tab.id].map((benefit, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-600 mt-1">{benefit.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipRankTabs;