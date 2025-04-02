import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, StarIcon, ShareIcon, CrownIcon } from 'lucide-react';
import { getUserRank } from '../../apis/customer';
import api from '../../config/axios';
import { assets } from '../../assets/frontend_assets/assets';
import MembershipRankTabs from './MembershipRankTabs';

const RewardPointsManagement = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [userRank, setUserRank] = useState("");
  const [nextRank, setNextRank] = useState("");
  const [amountToNextRank, setAmountToNextRank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState({
    fullName: "",
    phone: "",
    gender: "",
    birthday: ""
  });

  const [formData, setFormData] = useState(user);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("get");
        const user = response.data.find(item => item.id == localStorage.getItem('id'));

        if (user) {
          var { fullName, phone, birthday, gender } = user;

          if (!phone) {
            phone = 'Vui lòng cập nhật';
          }
          if (!birthday) {
            birthday = '';
          }
          setUser({
            fullName: fullName || "",
            phone: phone,
            gender: gender || "",
            birthday: birthday || ""
          });

          setFormData({
            fullName: fullName || "",
            phone: phone,
            gender: gender || "",
            birthday: birthday || ""
          });
        } else {
          console.log("User not found!.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };
    fetchUserData();
  }, []);

  // Keep original rank thresholds
  const rankThresholds = [
    { amount: 0, rank: "Bronze" },
    { amount: 5000000, rank: "Silver" },
    { amount: 10000000, rank: "Gold" },
    { amount: 20000000, rank: "Diamond" }
  ];


  useEffect(() => {
    const fetchUserRank = async () => {
      try {
        const response = await getUserRank();
        setUserPoints(response || 0);

        let currentRank = "Bronze";
        let nextRankName = "Silver";
        let nextRankAmount = 5000000;
        let progressPercentage = 0;

        for (let i = rankThresholds.length - 1; i >= 0; i--) {
          if (userPoints >= rankThresholds[i].amount) {
            currentRank = rankThresholds[i].rank;

            if (i < rankThresholds.length - 1) {
              nextRankName = rankThresholds[i + 1].rank;
              nextRankAmount = rankThresholds[i + 1].amount - userPoints;
              const nextThreshold = rankThresholds[i + 1].amount;
              progressPercentage = (userPoints / nextThreshold) * 100;
            } else {
              nextRankName = "Max Rank";
              nextRankAmount = 0;
              progressPercentage = 100;
            }
            break;
          }
        }

        setUserRank(currentRank);
        setNextRank(nextRankName);
        setAmountToNextRank(nextRankAmount);
        setProgress(progressPercentage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user rank:", error);
        setLoading(false);
      }
    };

    fetchUserRank();
  }, [userPoints]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + " đ";
  };

  // Get appropriate rank color
  const getRankColor = (rank) => {
    switch (rank) {
      case "Bronze": return "text-amber-700";
      case "Silver": return "text-gray-500";
      case "Gold": return "text-yellow-500";
      case "Diamond": return "text-blue-500";
      default: return "text-gray-700";
    }
  };

  return (
    <div className="mx-auto w-full">
      {/* User Profile Section - Similar to Image */}
      <div className="flex items-center space-x-4 p-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500">
          <img src={assets.icon} alt="User Avatar" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-rose-600">{user.fullName}</h1>
          <div className="flex space-x-2">
            <span className="text-gray-600 flex items-center">Số điện thoại: {user.phone} <span className="ml-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" /></svg></span></span>
          </div>
          <div className="flex space-x-2 mt-1">
            <span className={`px-3 py-1 text-sm bg-rose-200 font-semibold rounded-full ${getRankColor(userRank)}`}>{userRank}</span>
          </div>
        </div>
      </div>

      {/* Points Card - Based on Image Layout */}
      <div className="bg-white rounded-lg border p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{user.fullName}</h2>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-red-600">{formatCurrency(userPoints)}</span>
            </div>
            <p className="text-sm text-gray-500">(Điểm tích lũy từ 01/01/2024)</p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-xl font-bold ${getRankColor(userRank)}`}>{userRank}</span>
            <CrownIcon className={`w-6 h-6 ${getRankColor(userRank)}`} />
          </div>
        </div>

        {/* Progress Bar - Based on Image Layout */}
        {nextRank !== "Max Rank" && (
          <div className="mt-4 relative">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="absolute" style={{ left: `${progress}%`, top: "-4px", transform: "translateX(-50%)" }}>
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          </div>
        )}

        {nextRank !== "Max Rank" && (
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              Bạn cần mua thêm <strong className="text-red-600">{formatCurrency(amountToNextRank)}</strong> để lên hạng {nextRank}
            </p>
          </div>
        )}
        {nextRank === "Max Rank" && (
          <p className="text-gray-700">Chúc mừng! Bạn đã đạt hạng thành viên cao nhất.</p>
        )}
      </div>

      {/* Membership Ranks Tabs - NEW SECTION */}
      <MembershipRankTabs />

      {/* Earn Rewards Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Cách nhận điểm thưởng</h2>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <ShoppingBagIcon className="w-5 h-5 text-green-600 mr-2 mt-1" />
            <span>Mua sắm: + số điểm tương ứng cho mỗi tổng tiền hóa đơn thanh toán</span>
          </li>
        </ul>
        <Link
          to="/shop"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
        >
          Mua hàng ngay
        </Link>
      </div>
    </div>
  );
};

export default RewardPointsManagement;