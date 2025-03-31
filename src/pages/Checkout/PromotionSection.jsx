import { useState } from 'react';
import { X, Tag, Clock } from "lucide-react";
import { getAllPromotions } from '../../apis/promotion';
import { applyPromotion } from '../../redux/features/cartSlice';
import { useDispatch } from 'react-redux';
import { assets } from '../../assets/frontend_assets/assets';

const PromotionSection = ({
    promotionCode,
    setPromotionCode,
    appliedPromotion,
    applyCoupon,
    removeAppliedPromotion,
    setAppliedPromotion,
    originalTotalPrice
}) => {
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [availablePromotions, setAvailablePromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const openPromotionModal = async () => {
        setLoading(true);
        try {
            const promotions = await getAllPromotions();
            const now = new Date();
            const validPromotions = promotions.filter(promotion => {
                const endDate = new Date(promotion.endDate);
                return endDate > now && promotion.numOfPromo > 0;
            });
            setAvailablePromotions(validPromotions);
            setShowPromotionModal(true);
        } catch (error) {
            console.error("Error fetching promotions:", error);
        } finally {
            setLoading(false);
        }
    };

    const selectPromotion = (promotion) => {
        setPromotionCode(promotion.name);
        setShowPromotionModal(false);

        dispatch(applyPromotion({
            code: promotion.name,
            amount: promotion.promoAmount,
            details: promotion
        }));
        setAppliedPromotion(promotion);
    };

    const getRemainingTime = (endDate) => {
        const end = new Date(endDate);
        const now = new Date();
        const diffMs = end - now;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHrs / 24);

        if (diffDays > 0) {
            return `Còn ${diffDays} ngày`;
        } else if (diffHrs > 0) {
            return `Còn ${diffHrs} giờ`;
        } else {
            return "Sắp hết hạn";
        }
    };

    const isExpiringToday = (endDate) => {
        const end = new Date(endDate);
        const now = new Date();
        const diffMs = end - now;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

        return diffHrs <= 24;
    };

    return (
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <div className="flex flex-1">
                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 border border-gray-300 rounded-l p-2"
                        value={promotionCode}
                        onChange={(e) => setPromotionCode(e.target.value)}
                        disabled={appliedPromotion}
                    />
                    {!appliedPromotion ? (
                        <button
                            className="bg-[#EE1F5B] text-white px-4 py-2 uppercase text-sm font-medium"
                            onClick={applyCoupon}
                        >
                            Áp dụng
                        </button>
                    ) : (
                        <button
                            className="bg-gray-400 text-white px-4 py-2 uppercase text-sm font-medium"
                            onClick={removeAppliedPromotion}
                        >
                            Hủy
                        </button>
                    )}
                </div>
                <button
                    onClick={openPromotionModal}
                    className="bg-blue-50 border border-blue-300 text-blue-700 rounded px-4 py-2 flex items-center justify-center"
                >
                    <Tag size={16} className="mr-2" />
                    <span>Chọn Voucher</span>
                </button>
            </div>

            {appliedPromotion && (
                <div className="mt-2 bg-green-100 p-2 rounded flex justify-between items-center">
                    <span className="text-green-800">
                        Đã áp dụng: {appliedPromotion.name} - Giảm {appliedPromotion.promoAmount.toLocaleString()} đ
                    </span>
                    <button
                        onClick={removeAppliedPromotion}
                        className="text-red-600 hover:text-red-800"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            <p className="text-gray-600 text-sm mt-2 mb-1">- Sau khi áp dụng, Mã giảm giá có thể không dùng được trong vòng 15 phút.</p>
            <p className="text-gray-600 text-sm">- Trong quá trình thanh toán, chúng tôi sẽ tạm khóa mã giảm giá của quý khách để đảm bảo phiên giao dịch được ổn định.</p>

            {/* Promotion Modal */}
            {showPromotionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-medium">Voucher của Shop</h3>
                            <button
                                onClick={() => setShowPromotionModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-2">
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#EE1F5B]"></div>
                                </div>
                            ) : availablePromotions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Không có mã giảm giá nào khả dụng
                                </div>
                            ) : (
                                availablePromotions.map((promotion) => {
                                    // Check if this promotion can be applied to the current order
                                    const isEligible = originalTotalPrice >= promotion.orderPrice;

                                    return (
                                        <div
                                            key={promotion.id}
                                            className="border border-gray-200 rounded-lg mb-3 flex overflow-hidden"
                                        >
                                            <div className="w-16 border-rose-500 border-r-4 flex items-center justify-center">
                                                <img
                                                    src={assets.promotion}
                                                    alt="shop logo"
                                                    className="w-12 h-12 object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 p-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-red-600 font-medium">
                                                            Giảm ₫{(promotion.promoAmount / 1000).toFixed(0)}k
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Đơn Tối Thiểu ₫{(promotion.orderPrice / 1000).toFixed(0)}k
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => isEligible && selectPromotion(promotion)}
                                                        className={`${isEligible ? 'bg-[#EE1F5B] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} px-3 py-1 rounded text-sm`}
                                                    >
                                                        Dùng ngay
                                                    </button>
                                                </div>
                                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                                    <Clock size={14} className="mr-1" />
                                                    {isExpiringToday(promotion.endDate) ? (
                                                        <span className="text-red-500">Sắp hết hạn: {getRemainingTime(promotion.endDate)}</span>
                                                    ) : (
                                                        <span>{getRemainingTime(promotion.endDate)}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <span>Còn lại: {promotion.numOfPromo} voucher</span>
                                                </div>
                                                {!isEligible && (
                                                    <div className="text-xs text-red-500 mt-1">
                                                        Đơn hàng chưa đạt giá trị tối thiểu
                                                    </div>
                                                )}
                                                {promotion.description && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {promotion.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionSection;